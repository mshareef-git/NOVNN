import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { guidedCatalog, findGuidedActivityInKind } from '@/activities/catalog';
import { GuidedActivityScreen } from '@/components/guided/guided-activity-screen';
import { GuidedNotFound } from '@/components/guided/guided-not-found';
import { Screen } from '@/components/layout/screen';
import { SessionHistory } from '@/components/session/session-history';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { SectionHeader } from '@/components/ui/section-header';
import { Spacing, Type } from '@/constants/theme';
import { sessionStore } from '@/exercise/session-storage';
import { useTheme } from '@/hooks/use-theme';
import { asanas, findActiveAsana, selectedSeconds, timingOptions, yogaSafety } from '@/yoga/asanas';

export function generateStaticParams() {
  return [...asanas, ...guidedCatalog('yoga')].map(({ id }) => ({ id }));
}

export default function YogaRoutineScreen() {
  const { id, hold, rest } = useLocalSearchParams<{ id?: string; hold?: string; rest?: string }>();
  const router = useRouter();
  const theme = useTheme();
  const asana = findActiveAsana(id);
  if (!asana) {
    const legacy = findGuidedActivityInKind('yoga', id);
    return legacy ? <GuidedActivityScreen activity={legacy} /> : <GuidedNotFound kind="yoga" />;
  }
  const holdSeconds = selectedSeconds(hold, asana.targetSeconds);
  const restSeconds = selectedSeconds(rest, 15);
  const body = [Type.body, { color: theme.text }];
  return <Screen>
    <Header title={asana.name} subtitle={`${asana.sanskrit} · ${asana.description}`} />
    <Card variant="surface" gap={Spacing.three}>
      <SectionHeader title="How to do it" />
      {asana.overview && <Text style={body}>{asana.overview}</Text>}
      {asana.benefits && <Text style={body}>{asana.benefits}</Text>}
      {asana.instructions.map((line, i) => <Text key={line} style={body}>{i + 1}. {line}</Text>)}
    </Card>
    <Card variant="tint" gap={Spacing.three}>
      <SectionHeader title="Prepare your chair and camera" />
      <Text style={body}>{yogaSafety}</Text>
      <Text style={body}>{asana.cameraHint}</Text>
    </Card>
    <Card gap={Spacing.three}>
      <SectionHeader title="Session timing" />
      {(['hold', 'rest'] as const).map(key => {
        const value = key === 'hold' ? holdSeconds : restSeconds;
        const index = timingOptions.indexOf(value);
        const label = key === 'hold' ? 'Hold' : 'Rest';
        const change = (delta: number) => router.setParams({ [key]: String(timingOptions[index + delta]) });
        return <View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.two }}>
          <Text style={[body, { flex: 1 }]}>{label} · {value} s</Text>
          <Button fullWidth={false} size="medium" variant="outline" title="−" accessibilityLabel={`Decrease ${label.toLowerCase()} time`}
            disabled={index === 0} onPress={() => change(-1)} />
          <Button fullWidth={false} size="medium" variant="outline" title="+" accessibilityLabel={`Increase ${label.toLowerCase()} time`}
            disabled={index === timingOptions.length - 1} onPress={() => change(1)} />
        </View>;
      })}
      <Text style={body}>Start with 10 seconds to prepare. Hold for {holdSeconds} seconds {asana.bilateral ? 'on the left, then on the right' : 'in each round'}. Complete three rounds with {restSeconds} seconds of rest between holds.</Text>
    </Card>
    <Button title="Start session" onPress={() => router.push({ pathname: '/yoga/session', params: { id: asana.id, hold: String(holdSeconds), rest: String(restSeconds) } })} />
    <SectionHeader title="Your yoga history" />
    <SessionHistory activityLabel="asana" store={sessionStore} exerciseId={asana.id} limit={5} onOpenSession={r => router.push({ pathname: '/yoga/result', params: { recordId: r.id } })} />
  </Screen>;
}
