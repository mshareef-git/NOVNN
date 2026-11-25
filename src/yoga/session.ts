import { timingOptions, holdCount, holdSide, type Asana, type HoldSide } from './asanas';
import type { Observation } from './posture';

export type YogaPhase = 'preparation' | 'waiting' | 'holding' | 'resting' | 'paused' | 'completed' | 'cancelled';
export type YogaHold = { side: HoldSide; autoMs: number; manualMs: number };
export type YogaResult = {
  status: 'completed' | 'cancelled'; targetSeconds: number; elapsedMs: number;
  interruptions: number; holds: YogaHold[];
};
export const heldMs = (h: YogaHold) => h.autoMs + h.manualMs;
export const completedHolds = (r: YogaResult) => r.holds.filter(h => heldMs(h) >= r.targetSeconds * 1000).length;
const GRACE = 600;

export class YogaSession {
  phase: YogaPhase = 'preparation';
  manual: boolean;
  remainingMs = 10000;
  elapsedMs = 0;
  interruptions = 0;
  observation: Observation = 'absent';
  readonly holds: YogaHold[] = [];
  private previous: YogaPhase = 'preparation';
  private previousTime: number;
  private lastValid: number | null = null;
  private stableSince: number | null = null;
  private continuous = false;

  constructor(readonly asana: Asana, now: number, readonly targetSeconds = asana.targetSeconds, readonly restSeconds = 15) {
    this.previousTime = now;
    this.manual = asana.manual;
    this.newHold();
  }
  get current() { return this.holds[this.holds.length - 1]; }
  get round() { return Math.ceil(this.holds.length / (this.asana.bilateral ? 2 : 1)); }
  get terminal() { return this.phase === 'completed' || this.phase === 'cancelled'; }

  private newHold() {
    this.holds.push({ side: holdSide(this.asana, this.holds.length), autoMs: 0, manualMs: 0 });
  }
  private waitForPosture() {
    this.phase = 'waiting';
    this.lastValid = this.stableSince = null;
    this.continuous = false;
    this.observation = 'absent';
    this.remainingMs = this.targetSeconds * 1000 - heldMs(this.current);
  }
  private credit(ms: number, mode: 'autoMs' | 'manualMs') {
    const delta = Math.min(ms, this.remainingMs);
    this.current[mode] += delta;
    this.remainingMs -= delta;
    if (this.remainingMs <= 0) {
      const other = mode === 'autoMs' ? 'manualMs' : 'autoMs';
      this.current[mode] = this.targetSeconds * 1000 - this.current[other];
      this.phase = this.holds.length === holdCount(this.asana) ? 'completed' : 'resting';
      this.remainingMs = this.phase === 'resting' ? this.restSeconds * 1000 : 0;
    }
    return delta;
  }
  tick(now: number) {
    if (this.terminal || now < this.previousTime) return;
    const delta = now - this.previousTime;
    this.previousTime = now;
    if (this.phase === 'paused') return;
    this.elapsedMs += delta;
    if (this.phase === 'holding' && this.manual) {
      const used = this.credit(delta, 'manualMs');
      const excess = delta - used;
      if (this.terminal) this.elapsedMs -= excess;
      else if (excess > 0) this.advanceCountdown(excess);
    } else if (this.phase === 'preparation' || this.phase === 'resting') {
      this.advanceCountdown(delta);
    } else if (!this.manual && this.lastValid !== null && now - this.lastValid > (this.asana.trackingGraceMs ?? GRACE)) {
      if (this.phase === 'holding') this.interrupt();
      else {
        this.stableSince = null;
        if (this.observation === 'valid') this.observation = 'absent';
      }
    }
  }
  private advanceCountdown(delta: number) {
    this.remainingMs = Math.max(0, this.remainingMs - delta);
    if (this.remainingMs === 0) {
      if (this.phase === 'resting') this.newHold();
      this.waitForPosture();
    }
  }
  private interrupt() {
    const observation = this.observation;
    this.interruptions++;
    this.waitForPosture();
    this.observation = observation === 'valid' ? 'absent' : observation;
  }
  observe(now: number, observation: Observation) {
    if (now < this.previousTime) return;
    this.tick(now);
    if (this.manual || (this.phase !== 'holding' && this.phase !== 'waiting')) return;
    this.observation = observation;
    if (observation !== 'valid') {
      this.continuous = false;
      // A briefly occluded joint is common in profile. Exclude the uncertain
      // interval from settling without discarding all earlier stable frames.
      if (observation !== 'insufficient') this.stableSince = null;
      return;
    }
    if (this.phase === 'waiting') {
      if (!this.continuous && this.stableSince !== null && this.lastValid !== null) {
        this.stableSince += now - this.lastValid;
      }
      this.stableSince ??= now;
      if (now - this.stableSince >= 2000) this.phase = 'holding';
    } else if (this.continuous && this.lastValid !== null) {
      this.credit(now - this.lastValid, 'autoMs');
    }
    this.lastValid = now;
    this.continuous = true;
  }
  cameraFailed(now: number) {
    this.tick(now);
    if (!this.manual && this.phase === 'holding') this.interrupt();
    this.observation = 'absent';
    this.lastValid = this.stableSince = null;
    this.continuous = false;
  }
  useManual(now: number) {
    this.tick(now);
    if (this.terminal || this.manual) return;
    this.manual = true;
    if (this.phase === 'holding' || this.phase === 'waiting') this.waitForPosture();
  }
  confirm(now: number) {
    this.tick(now);
    if (this.manual && this.phase === 'waiting') this.phase = 'holding';
  }
  skipRest(now: number) {
    this.tick(now);
    if (this.phase === 'resting') this.advanceCountdown(this.remainingMs);
  }
  pause(now: number) {
    this.tick(now);
    if (this.terminal || this.phase === 'paused') return;
    this.previous = this.phase;
    this.phase = 'paused';
  }
  resume(now: number) {
    if (this.phase !== 'paused') return;
    this.previousTime = Math.max(this.previousTime, now);
    this.phase = this.previous;
    if (this.phase === 'holding' || this.phase === 'waiting') this.waitForPosture();
  }
  end(now: number) {
    this.tick(now);
    if (!this.terminal) this.phase = 'cancelled';
  }
  result(): YogaResult {
    if (!this.terminal) throw new Error('Yoga session is still active');
    return { status: this.phase === 'completed' ? 'completed' : 'cancelled', targetSeconds: this.targetSeconds,
      elapsedMs: Math.round(this.elapsedMs), interruptions: this.interruptions,
      holds: this.holds.map(h => ({ side: h.side, autoMs: Math.floor(h.autoMs),
        manualMs: Math.max(0, Math.floor(heldMs(h)) - Math.floor(h.autoMs)) })) };
  }
}

export function isYogaResult(value: unknown, asana?: Asana): value is YogaResult {
  if (!asana || !value || typeof value !== 'object') return false;
  const r = value as Partial<YogaResult>;
  const integer = (n: unknown): n is number => typeof n === 'number' && Number.isSafeInteger(n) && n >= 0;
  if ((r.status !== 'completed' && r.status !== 'cancelled') || !integer(r.targetSeconds) || !timingOptions.includes(r.targetSeconds) ||
      !integer(r.elapsedMs) || !integer(r.interruptions) || !Array.isArray(r.holds) ||
      !r.holds.length || r.holds.length > holdCount(asana)) return false;
  const target = r.targetSeconds * 1000;
  if (!r.holds.every((h, i) => h && h.side === holdSide(asana, i) && integer(h.autoMs) &&
    integer(h.manualMs) && (!asana.manual || h.autoMs === 0) && heldMs(h) <= target &&
    (i === r.holds!.length - 1 || heldMs(h) === target))) return false;
  const finished = r.holds.length === holdCount(asana) && heldMs(r.holds[r.holds.length - 1]) === target;
  return (r.status === 'completed') === finished && r.holds.reduce((n, h) => n + heldMs(h), 0) <= r.elapsedMs + 1;
}
