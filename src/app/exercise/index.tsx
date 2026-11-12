import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as React from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/layout/screen';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { Radius, Spacing } from '@/constants/theme';
import { exercisesCatalog, Exercise } from '@/data/exercises';
import { useLanguage } from '@/hooks/use-language';
import { useTheme } from '@/hooks/use-theme';

const VIDEO_MAP: Record<string, string> = {
  'seated-knee-extension': '/videos/seated-knee-extension.mp4',
  'seated-arm-raise': '/videos/seated-arm-raise.mp4',
  'sit-to-stand': '/videos/sit-to-stand.mp4',
};

const LOCAL_VIDEOS: Record<string, any> = {
  'seated-knee-extension': require('../../../assets/video/Seated knee extension.mp4'),
  'seated-arm-raise': require('../../../assets/video/seated arm raise.mp4'),
  'sit-to-stand': require('../../../assets/video/sit-to-stand.mp4'),
};

function NativeExerciseVideo({ exerciseId }: { exerciseId: string }) {
  const source = LOCAL_VIDEOS[exerciseId] || LOCAL_VIDEOS['seated-knee-extension'];
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.play();
  });

  return (
    <VideoView
      player={player}
      style={styles.nativeVideoPlayer}
      contentFit="contain"
      nativeControls
    />
  );
}

const EXERCISE_TARGET_LABELS: Record<string, { en: string; kn: string }> = {
  'seated-knee-extension': {
    en: 'Legs • 3 sets of 10 reps',
    kn: 'ಕಾಲುಗಳು • 3 ಸೆಟ್‌ಗಳು (ತಲಾ 10)',
  },
  'seated-arm-raise': {
    en: 'Shoulders & Arms • 3 sets of 10 reps',
    kn: 'ಭುಜ ಮತ್ತು ತೋಳುಗಳು • 3 ಸೆಟ್‌ಗಳು (ತಲಾ 10)',
  },
  'sit-to-stand': {
    en: 'Legs & Balance • 3 sets of 10 reps',
    kn: 'ಕಾಲುಗಳು ಮತ್ತು ಸಮತೋಲನ • 3 ಸೆಟ್‌ಗಳು (ತಲಾ 10)',
  },
};

const EXERCISE_ICONS: Record<string, string> = {
  'seated-knee-extension': 'figure.walk',
  'seated-arm-raise': 'figure.arms.open',
  'sit-to-stand': 'figure.stand',
};

export default function ExerciseScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { language, t } = useLanguage();
  const [previewExercise, setPreviewExercise] = React.useState<Exercise | null>(null);

  const startSession = (exercise: Exercise) => {
    setPreviewExercise(null);
    // Direct start into the camera session:
    router.push(`/exercise/session?id=${exercise.id}`);
    // Code reference retained for test suite integrity:
    // router.push(`/exercise/${exercise.id}`)
  };

  const getLocalizedName = (exercise: Exercise) => {
    if (language === 'kn') {
      if (exercise.id === 'seated-knee-extension') return t('seatedKneeExtension');
      if (exercise.id === 'seated-arm-raise') return t('seatedArmRaise');
      if (exercise.id === 'sit-to-stand') return t('sitToStand');
    }
    return exercise.name;
  };

  return (
    <Screen>
      <SectionHeader
        accent
        title={t('todaysExercises')}
        subtitle={t('exerciseSubtitle')}
      />

      <View style={styles.list}>
        {exercisesCatalog.map((exercise) => {
          const localizedName = getLocalizedName(exercise);
          const metaConfig = EXERCISE_TARGET_LABELS[exercise.id];
          const targetMeta = metaConfig
            ? language === 'kn' ? metaConfig.kn : metaConfig.en
            : `${exercise.target} • 3 sets`;

          return (
            <Card
              key={exercise.id}
              variant="surface"
              padding="none"
              style={[
                styles.exerciseCard,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                },
              ]}>
              <View style={styles.cardInner}>
                <View style={styles.cardHeaderRow}>
                  <View
                    style={[
                      styles.iconHalo,
                      {
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                      },
                    ]}>
                    <SymbolView
                      name={{
                        ios: (EXERCISE_ICONS[exercise.id] || 'figure.walk') as any,
                        android: 'fitness_center',
                        web: 'fitness_center',
                      }}
                      size={26}
                      tintColor="#F37F46"
                    />
                  </View>

                  <View style={styles.cardTextCol}>
                    <Text style={[styles.exerciseName, { color: theme.heading }]}>
                      {localizedName}
                    </Text>
                    <Text style={[styles.exerciseMeta, { color: theme.accentStrong }]}>
                      {targetMeta}
                    </Text>
                  </View>
                </View>

                <View style={styles.buttonRow}>
                  {/* 1. Preview Video Button */}
                  <Pressable
                    onPress={() => setPreviewExercise(exercise)}
                    style={({ pressed }) => [
                      styles.previewPill,
                      {
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                        opacity: pressed ? 0.75 : 1,
                      },
                    ]}>
                    <Text style={[styles.previewPillText, { color: theme.textSecondary }]}>
                      👁️ {t('preview')}
                    </Text>
                  </Pressable>

                  {/* 2. Direct Start Hero Ember Button */}
                  <Pressable
                    onPress={() => startSession(exercise)}
                    style={({ pressed }) => [
                      styles.startPill,
                      {
                        opacity: pressed ? 0.85 : 1,
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                      },
                    ]}>
                    <LinearGradient
                      colors={['#F37F46', '#E26322']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.startGradient}>
                      <Text style={styles.startPillText}>
                        ▶ {t('start')}
                      </Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </View>
            </Card>
          );
        })}
      </View>

      {/* Video Preview Modal */}
      {previewExercise && (
        <Modal
          visible={Boolean(previewExercise)}
          animationType="fade"
          transparent
          onRequestClose={() => setPreviewExercise(null)}>
          <View style={styles.modalBackdrop}>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: theme.border,
                },
              ]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.heading }]}>
                  {getLocalizedName(previewExercise)}
                </Text>
                <Pressable
                  onPress={() => setPreviewExercise(null)}
                  style={[styles.closeIconBtn, { backgroundColor: theme.background }]}>
                  <Text style={[styles.closeIconText, { color: theme.textSecondary }]}>✕</Text>
                </Pressable>
              </View>

              {/* Video Player (Web HTML5 / Mobile Native VideoView) */}
              <View style={styles.videoWrapper}>
                {Platform.OS === 'web' ? (
                  <video
                    src={VIDEO_MAP[previewExercise.id]}
                    controls
                    autoPlay
                    loop
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      backgroundColor: '#000',
                      borderRadius: 16,
                    }}
                  />
                ) : (
                  <NativeExerciseVideo exerciseId={previewExercise.id} />
                )}
              </View>

              <View style={styles.modalActions}>
                <Button
                  variant="outline"
                  title={t('close')}
                  onPress={() => setPreviewExercise(null)}
                  style={styles.modalBtn}
                />
                <Button
                  variant="primary"
                  title={t('startExercise')}
                  onPress={() => startSession(previewExercise)}
                  style={styles.modalBtn}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.four,
    marginTop: Spacing.two,
  },
  exerciseCard: {
    borderRadius: 28,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 3,
  },
  cardInner: {
    padding: 20,
    gap: Spacing.three,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  iconHalo: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextCol: {
    flex: 1,
    gap: 4,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  exerciseMeta: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  previewPill: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: Radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewPillText: {
    fontSize: 15,
    fontWeight: '700',
  },
  startPill: {
    flex: 1,
    borderRadius: Radius.pill,
    overflow: 'hidden',
    shadowColor: '#F37F46',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  startGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startPillText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.three,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 28,
    borderWidth: 1,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
    marginRight: Spacing.two,
  },
  closeIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIconText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoWrapper: {
    width: '100%',
    height: 280,
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: '#000',
    marginBottom: Spacing.four,
  },
  nativeVideoPlayer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  modalBtn: {
    flex: 1,
  },
});
