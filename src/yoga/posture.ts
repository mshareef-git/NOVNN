import type { PoseFrameEventPayload } from '../../modules/pose-tracker';
import { isTrustedLandmark } from '../exercise/landmark-trust';
import type { Asana, HoldSide } from './asanas';

export type Observation = 'valid' | 'invalid' | 'insufficient' | 'absent';
const saluteLimits = { wristRise: 0.12, elbowDrop: 0.16, maxTorsoLean: 35 };

export function observePosture(asana: Asana, side: HoldSide, frame: PoseFrameEventPayload): Observation {
  if (frame.presence !== 'tracked') return 'absent';
  if (asana.manual || !(frame.imageWidth > 0 && frame.imageHeight > 0)) return 'insufficient';
  const aspect = frame.imageWidth / frame.imageHeight;
  const point = (name: string) => {
    const p = frame.landmarks.find(item => item.name === name);
    return isTrustedLandmark(p, 0.55) && p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1 ? p : undefined;
  };
  if (asana.id === 'urdhva-hastasana') {
    let raised = true;
    for (const prefix of ['LEFT', 'RIGHT']) {
      const shoulder = point(prefix + '_SHOULDER'), elbow = point(prefix + '_ELBOW'), wrist = point(prefix + '_WRIST');
      if (!shoulder || !elbow || !wrist) return 'insufficient';
      const upper = Math.hypot((shoulder.x - elbow.x) * aspect, shoulder.y - elbow.y);
      const forearm = Math.hypot((elbow.x - wrist.x) * aspect, elbow.y - wrist.y);
      if (!upper || !forearm) return 'insufficient';
      const length = upper + forearm;
      if (shoulder.y - wrist.y < saluteLimits.wristRise * length ||
          elbow.y - shoulder.y > saluteLimits.elbowDrop * length) raised = false;
    }
    const lh = point('LEFT_HIP'), rh = point('RIGHT_HIP');
    if (lh && rh) {
      const l = point('LEFT_SHOULDER')!, r = point('RIGHT_SHOULDER')!;
      const tilt = Math.atan2(Math.abs(l.x + r.x - lh.x - rh.x) * aspect, lh.y + rh.y - l.y - r.y);
      if (tilt * 180 / Math.PI > saluteLimits.maxTorsoLean) return 'invalid';
    }
    return raised ? 'valid' : 'invalid';
  }
  if (!asana.bilateral) {
    let visible = false;
    for (const prefix of ['LEFT', 'RIGHT']) {
      const shoulder = point(prefix + '_SHOULDER'), hip = point(prefix + '_HIP');
      const knee = point(prefix + '_KNEE'), ankle = point(prefix + '_ANKLE');
      if (!shoulder || !hip || !knee || !ankle || hip.y - shoulder.y < 0.05) continue;
      // The thigh points into the camera in a front view and across the
      // image in profile. Include depth to preserve the seated knee angle.
      const thigh = [(hip.x - knee.x) * aspect, hip.y - knee.y, (hip.z - knee.z) * aspect];
      const shin = [(ankle.x - knee.x) * aspect, ankle.y - knee.y, (ankle.z - knee.z) * aspect];
      const cosine = thigh.reduce((sum, value, i) => sum + value * shin[i], 0)
        / (Math.hypot(...thigh) * Math.hypot(...shin));
      const bend = Math.acos(Math.max(-1, Math.min(1, cosine))) * 180 / Math.PI;
      if (!Number.isFinite(bend)) continue;
      visible = true;
      const lean = Math.atan2(Math.abs(shoulder.x - hip.x) * aspect, hip.y - shoulder.y);
      if (lean <= Math.PI / 10 && bend >= 60 && bend <= 125 && ankle.y > knee.y &&
          Math.abs(hip.y - knee.y) < 0.65 * (hip.y - shoulder.y)) return 'valid';
    }
    return visible ? 'invalid' : 'insufficient';
  }
  const l = point('LEFT_SHOULDER'), r = point('RIGHT_SHOULDER');
  const lh = point('LEFT_HIP'), rh = point('RIGHT_HIP');
  if (!l || !r || !lh || !rh) return 'insufficient';
  const height = (lh.y + rh.y - l.y - r.y) / 2;
  // Work in the horizontal (x, depth) plane. Anatomical left is the
  // direction from right hip to left hip, even when the chair is in profile.
  const hipX = lh.x - rh.x, hipZ = lh.z - rh.z;
  const shoulderX = l.x - r.x, shoulderZ = l.z - r.z;
  const hipSpan = Math.hypot(hipX, hipZ);
  const shoulderSpan = Math.hypot(shoulderX, shoulderZ);
  if (![hipSpan, shoulderSpan].every(Number.isFinite) || height < 0.05 ||
      hipSpan * aspect < 0.20 * height || shoulderSpan * aspect < 0.35 * height) return 'insufficient';
  const offsetX = (l.x + r.x - lh.x - rh.x) / 2;
  const offsetZ = (l.z + r.z - lh.z - rh.z) / 2;
  const lateral = (offsetX * hipX + offsetZ * hipZ) * aspect / hipSpan;
  const direction = side === 'left' ? 1 : -1;
  const lean = direction * Math.atan2(lateral, height) * 180 / Math.PI;
  return lean >= 7 && lean <= 35 ? 'valid' : 'invalid';
}
