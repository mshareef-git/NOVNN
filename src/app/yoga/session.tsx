import { Camera } from 'expo-camera';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AppState, Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { YogaCamera } from '@/components/session/yoga-camera';
import type { PoseFrameEventPayload } from '../../../modules/pose-tracker';
import { GuidedNotFound } from '@/components/guided/guided-not-found';
import { Screen } from '@/components/layout/screen';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { Radius, Spacing, Type } from '@/constants/theme';
import { createSessionId, createSessionRecord } from '@/exercise/session-store';
import { sessionStore } from '@/exercise/session-storage';
import { useTheme } from '@/hooks/use-theme';
import { findActiveAsana, selectedSeconds, yogaSafety, type Asana } from '@/yoga/asanas';
import { observePosture, type Observation } from '@/yoga/posture';
import { completedHolds, YogaSession } from '@/yoga/session';

const statusText: Record<Observation, string> = {
  valid: 'Posture detected', invalid: 'Adjust gently or use manual timing.',
  insufficient: 'Some joints are unclear. Check the camera position.',
  absent: 'No pose detected. Move into camera view.',
};
const now = () => performance.now();
function viewOf(engine: YogaSession) {
  return { phase: engine.phase, seconds: Math.ceil(engine.remainingMs / 1000), side: engine.current.side,
    round: engine.round, observation: engine.observation, manual: engine.manual };
}

const emptySubscribe = () => () => {};

export default function YogaSessionRoute() {
  const { id, hold, rest } = useLocalSearchParams<{ id?: string; hold?: string; rest?: string }>();
  // Static web exports render this route without its query string.
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  if (!mounted) return <Screen><Header title="Opening session…" /></Screen>;
  const asana = findActiveAsana(id);
  return asana ? <Session key={asana.id} asana={asana} holdSeconds={selectedSeconds(hold, asana.targetSeconds)} restSeconds={selectedSeconds(rest, 15)} /> : <GuidedNotFound kind="yoga" />;
}

function Session({ asana, holdSeconds, restSeconds }: { asana: Asana; holdSeconds: number; restSeconds: number }) {
  const { width } = useWindowDimensions();
  const desktop = Platform.OS === 'web' && width >= 1000;
  const theme = useTheme();
  const router = useRouter();
  const [engine] = useState(() => new YogaSession(asana, now(), holdSeconds, restSeconds));
  const [recordId] = useState(createSessionId);
  const [view, setView] = useState(() => viewOf(engine));
  const [camera, setCamera] = useState<'requesting' | 'ready' | 'unavailable'>('requesting');
  const [cameraMessage, setCameraMessage] = useState('');
  const lastCapture = useRef<number | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [saveAttempt, setSaveAttempt] = useState(0);
  const [saveError, setSaveError] = useState(false);
  const [visible, setVisible] = useState(true);
  const terminal = view.phase === 'completed' || view.phase === 'cancelled';

  const refresh = useCallback(() => {
    const next = viewOf(engine);
    setView(prev => prev.phase === next.phase && prev.seconds === next.seconds && prev.side === next.side &&
      prev.round === next.round && prev.observation === next.observation && prev.manual === next.manual ? prev : next);
  }, [engine]);
  const end = () => { engine.end(now()); refresh(); };
  usePreventRemove(!terminal, end);

  useEffect(() => {
    if (terminal) return;
    let active = true;
    async function permission() {
      try {
        const allowed = Platform.OS === 'web' ? !!globalThis.navigator?.mediaDevices?.getUserMedia :
          (await Camera.requestCameraPermissionsAsync()).granted;
        if (active) {
          setCamera(allowed ? 'ready' : 'unavailable');
          if (!allowed) setCameraMessage('Camera access is unavailable. Allow camera access in settings or choose manual timing.');
        }
      } catch {
        if (active) { setCamera('unavailable'); setCameraMessage('Camera access failed. Retry or choose manual timing.'); }
      }
    }
    void permission();
    return () => { active = false; };
  }, [attempt, terminal]);

  useFocusEffect(useCallback(() => {
    const suspend = () => { engine.pause(now()); refresh(); };
    const lifecycle = AppState.addEventListener('change', state => {
      setVisible(state === 'active');
      if (state !== 'active') suspend();
    });
    const visibility = () => { setVisible(!document.hidden); if (document.hidden) suspend(); };
    if (Platform.OS === 'web') document.addEventListener('visibilitychange', visibility);
    return () => {
      lifecycle.remove();
      if (Platform.OS === 'web') document.removeEventListener('visibilitychange', visibility);
      suspend();
    };
  }, [engine, refresh]));

  useEffect(() => {
    if (terminal || view.phase === 'paused') return;
    const timer = setInterval(() => { engine.tick(now()); refresh(); }, 150);
    return () => clearInterval(timer);
  }, [engine, refresh, terminal, view.phase]);

  useEffect(() => {
    if (!terminal) return;
    let active = true;
    const yoga = engine.result();
    const record = createSessionRecord({ id: recordId, activityKind: 'yoga', exerciseId: asana.id,
      exerciseName: asana.name, completedAt: new Date().toISOString(), yoga, stepsCompleted: completedHolds(yoga),
      metrics: { reps: 0, durationSeconds: Math.floor(yoga.elapsedMs / 1000), paceRpm: null, rangeMinDeg: null,
        rangeMaxDeg: null, consistencyPct: null } });
    void sessionStore.saveSession(record).then(() => {
      if (active) router.replace({ pathname: '/yoga/result', params: { recordId } });
    }).catch(() => { if (active) setSaveError(true); });
    return () => { active = false; };
  }, [asana, engine, recordId, router, saveAttempt, terminal]);

  const poseFrame = useCallback(({ nativeEvent }: { nativeEvent: PoseFrameEventPayload }) => {
    if (engine.manual || engine.terminal || engine.phase === 'paused') return;
    if (!Number.isFinite(nativeEvent.timestampMs) || (lastCapture.current !== null && nativeEvent.timestampMs <= lastCapture.current)) return;
    lastCapture.current = nativeEvent.timestampMs;
    engine.observe(now(), observePosture(asana, engine.current.side, nativeEvent));
    refresh();
  }, [asana, engine, refresh]);
  const act = (action: () => void) => { action(); refresh(); };
  const body = [Type.body, { color: theme.text }];
  if (terminal) return <Screen>
    <Header title={view.phase === 'completed' ? 'Session completed' : 'Session ended early'} />
    <Text style={body}>{saveError ? 'Your result could not be saved on this device.' : 'Saving your yoga session…'}</Text>
    {saveError && <>
      <Button title="Retry saving" onPress={() => { setSaveError(false); setSaveAttempt(n => n + 1); }} />
      <Button variant="outline" title="Leave without saving" onPress={() => router.replace('/yoga')} />
    </>}
  </Screen>;

  const headline = { preparation: 'Prepare your chair', waiting: view.manual ? 'Confirm your position' : 'Waiting for stable posture',
    holding: 'Hold comfortably', resting: asana.id === 'urdhva-hastasana' ? 'Slowly lower your arms and relax' : 'Rest and return to center', paused: 'Session paused',
    completed: 'Session complete', cancelled: 'Session ended' }[view.phase];
  const clock = [Math.floor(view.seconds / 60), view.seconds % 60].map(n => String(n).padStart(2, '0')).join(':');
  const label = [Type.label, { color: theme.textSecondary }];
  const postureCue = asana.id === 'urdhva-hastasana' && view.observation === 'invalid'
    ? 'Raise both arms gently, only as far as comfortable. Keep your shoulders relaxed.'
    : view.observation === 'insufficient' ? asana.cameraHint : statusText[view.observation];
  const timer = (
    <Card gap={Spacing.two} style={desktop && styles.sidebar}>
      <Text style={[styles.clock, { color: theme.heading }]}>{clock}</Text>
      <Text style={[label, styles.center]}>{view.phase === 'resting' ? 'Rest remaining' : view.phase === 'preparation' ? 'Preparation remaining' : 'Time remaining'}</Text>
      <Text style={label}>Round {view.round} of 3{view.side !== 'center' && ' · ' + view.side + ' side'}</Text>
      <Text style={[Type.heading, { color: theme.heading }]}>{engine.targetSeconds} seconds</Text>
      <Text style={label}>Hold target</Text>
    </Card>
  );
  return <Screen onBack={end} contentStyle={[styles.content, desktop && styles.desktopContent]}>
    <Text accessibilityRole="header" style={[Type.heading, styles.center, { color: theme.heading }]}>{asana.name}</Text>
    <View style={desktop ? styles.desktopStage : styles.mobileStage}>
      {desktop && timer}
      <View style={[styles.preview, desktop && styles.desktopPreview, { backgroundColor: theme.cameraSurface, borderColor: theme.glassBorder }]}>
        {camera === 'ready' && visible && view.phase !== 'paused' ? (
          <YogaCamera key={attempt} exerciseId={asana.id} onFrame={() => {}} onPoseFrame={poseFrame}
            onError={({ nativeEvent }) => {
              engine.cameraFailed(now()); refresh(); setCamera('unavailable'); setCameraMessage(nativeEvent.message);
            }} />
        ) : <Text style={styles.cameraStatus}>{view.phase === 'paused' || !visible ? 'Camera paused' : camera === 'requesting' ? 'Opening camera…' : 'Camera unavailable'}</Text>}
      </View>
      {!desktop && timer}
      <View style={[styles.controls, desktop && styles.sidebar]}>
        <Card gap={Spacing.three}>
          <Text style={label}>Guidance</Text>
          <Text accessibilityRole="header" accessibilityLiveRegion="polite" style={[Type.heading, { color: theme.heading }]}>{headline}</Text>
          {view.phase === 'preparation' && <Text style={body}>{asana.cameraHint}</Text>}
          {view.phase === 'waiting' && <Text style={body}>{view.manual ? 'When comfortably positioned, start this hold.' :
            view.observation === 'valid' ? 'Stay comfortably in position for two seconds.' : postureCue}</Text>}
          {view.phase === 'holding' && !view.manual && view.observation !== 'valid' && <Text style={body}>{postureCue}</Text>}
          <Text style={label}>{view.manual ? 'Manually timed hold' : 'Camera-guided hold'}</Text>
        </Card>
        {view.phase === 'waiting' && view.manual && <Button title="I’m in position · Start hold" onPress={() => act(() => engine.confirm(now()))} />}
        {view.phase === 'resting' && <Button title="Skip rest" onPress={() => act(() => engine.skipRest(now()))} />}
        {view.phase === 'paused' ? <Button title="Resume session" onPress={() => act(() => engine.resume(now()))} /> :
          <Button title="Pause session" onPress={() => act(() => engine.pause(now()))} />}
        <Button variant="outline" title="End session" onPress={end} />
        {camera === 'unavailable' && <Card variant="surface" gap={Spacing.three}>
          <Text accessibilityRole="alert" style={body}>{cameraMessage}</Text>
          <Button variant="outline" title="Retry camera" onPress={() => { lastCapture.current = null; setCamera('requesting'); setAttempt(n => n + 1); }} />
        </Card>}
        {!view.manual && <Button variant="secondary" title="Use manual timing" onPress={() => act(() => engine.useManual(now()))} />}
      </View>
    </View>
    <Card gap={Spacing.two}>
      <Text accessibilityRole="header" style={[Type.subheading, { color: theme.heading }]}>Instructions</Text>
      {asana.instructions.map(step => <View key={step} style={styles.step}>
        <Text style={[Type.body, { color: theme.accent }]}>•</Text>
        <Text style={[body, styles.stepText]}>{step}</Text>
      </View>)}
      <Text style={[Type.caption, { color: theme.text }]}>{yogaSafety}</Text>
    </Card>
  </Screen>;
}

const styles = StyleSheet.create({
  content: { gap: Spacing.four, paddingTop: Spacing.three },
  desktopContent: { maxWidth: 1360, paddingHorizontal: 32 },
  desktopStage: { flexDirection: 'row', alignItems: 'flex-start', gap: 24 },
  mobileStage: { gap: Spacing.four },
  sidebar: { width: 260 },
  controls: { gap: 10 },
  center: { textAlign: 'center' },
  clock: { ...Type.headingLarge, fontSize: 52, lineHeight: 60, textAlign: 'center', fontVariant: ['tabular-nums'] },
  preview: { width: '100%', aspectRatio: 1, borderRadius: Radius.card, overflow: 'hidden',
    borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  desktopPreview: { flex: 1, width: undefined, aspectRatio: 4 / 3 },
  cameraStatus: { ...Type.label, color: '#FFFFFF' },
  step: { flexDirection: 'row', gap: Spacing.three },
  stepText: { flex: 1 },
});
