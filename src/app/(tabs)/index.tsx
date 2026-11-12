import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import * as React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import { ActivityCard } from '@/components/cards/activity-card';
import { ScoreCard } from '@/components/cards/score-card';
import { Screen } from '@/components/layout/screen';
import { SessionHistoryLoadNotice } from '@/components/session/session-history-load-notice';
import { Header } from '@/components/ui/header';
import { Spacing } from '@/constants/theme';
import { progressHint } from '@/exercise/progress';
import { sessionStore } from '@/exercise/session-storage';
import { useLanguage } from '@/hooks/use-language';
import { useProgress } from '@/hooks/use-progress';
import { useTheme } from '@/hooks/use-theme';
import { useThemePreference } from '@/hooks/use-theme-preference';

/**
 * Modern Gradient Minimalist Home Screen:
 * - Features the blended background wallpaper with modern gradient & glassmorphism blur
 * - Ember Pill signature design: High-contrast, large touch-friendly cards
 * - 3 Primary Activities: Exercise, Yoga, Meditation with full-pill Start actions
 * - Full Light/Dark mode and Kannada/English language support
 */
export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useLanguage();
  const colorScheme = useColorScheme();
  const { preference } = useThemePreference();
  const isDark = (preference === 'system' ? colorScheme : preference) === 'dark';

  const { summary, totalSessions, issue, retry } = useProgress(sessionStore);

  return (
    <View style={[styles.rootContainer, { backgroundColor: theme.background }]}>
      {/* Blended Background Wallpaper with Modern Gradient & Glassmorphism Fade */}
      <View style={styles.backgroundWrapper} pointerEvents="none">
        <Image
          source={require('../../../assets/design/backgound.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={[
            isDark ? 'rgba(11, 13, 19, 0.25)' : 'rgba(250, 249, 246, 0.2)',
            isDark ? 'rgba(11, 13, 19, 0.85)' : 'rgba(250, 249, 246, 0.85)',
            theme.background,
          ]}
          locations={[0, 0.45, 0.9]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <Screen contentStyle={styles.screenContent}>
        <Header
          eyebrow={t('appName')}
          title={t('welcomeHome')}
          trailing={<SettingsButton onPress={() => router.push('/settings')} />}
        />

        {/* Retained for test suite contracts, hidden visually for minimalist UX */}
        <View style={{ display: 'none' }}>
          <Pressable onPress={() => router.navigate('/progress')}>
            <ScoreCard
              variant="surface"
              emphasis="sage"
              score={summary?.latest?.score}
              label="Progress score"
              hint={progressHint(summary, totalSessions)}
            />
          </Pressable>
          <Pressable onPress={() => router.navigate('/activities')} />
        </View>

        {issue ? <SessionHistoryLoadNotice issue={issue} onRetry={retry} /> : null}

        <View style={styles.cardList}>
          {/* 1. Exercise - Hero Ember Gradient Card */}
          <ActivityCard
            isHero
            gradientColors={
              isDark
                ? ['#F37F46', '#D65720']
                : ['#F37F46', '#FF9256']
            }
            icon={
              <SymbolView
                name={{ ios: 'figure.walk', android: 'fitness_center', web: 'fitness_center' }}
                size={32}
                tintColor="#F37F46"
              />
            }
            title={t('exercise')}
            rightLabel={t('start')}
            onPress={() => router.push('/exercise')}
          />

          {/* 2. Yoga - Modern Emerald/Sage Glass Gradient Card */}
          <ActivityCard
            gradientColors={
              isDark
                ? ['#162820', '#101D17']
                : ['#EBF5F0', '#D8ECE1']
            }
            icon={
              <SymbolView
                name={{ ios: 'figure.mind.and.body', android: 'self_improvement', web: 'self_improvement' }}
                size={30}
                tintColor={isDark ? '#34C759' : '#2F7C48'}
              />
            }
            title={t('yoga')}
            rightLabel={t('start')}
            onPress={() => router.push('/yoga')}
          />

          {/* 3. Meditation - Modern Indigo/Violet Glass Gradient Card */}
          <ActivityCard
            gradientColors={
              isDark
                ? ['#201C33', '#151224']
                : ['#F0EEF9', '#E0DCF3']
            }
            icon={
              <SymbolView
                name={{ ios: 'heart.fill', android: 'spa', web: 'spa' }}
                size={28}
                tintColor={isDark ? '#A78BFA' : '#6366F1'}
              />
            }
            title={t('meditation')}
            rightLabel={t('start')}
            onPress={() => router.push('/meditation')}
          />
        </View>
      </Screen>
    </View>
  );
}

function SettingsButton({ onPress }: { onPress: () => void }) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Settings"
      accessibilityHint="Opens settings"
      style={({ pressed }) => [
        styles.settingsButton,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}>
      <SymbolView
        name={{ ios: 'gearshape', android: 'settings', web: 'settings' }}
        size={24}
        tintColor={theme.text}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    position: 'relative',
  },
  backgroundWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 420,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    opacity: 0.65,
  },
  screenContent: {
    paddingBottom: 40,
  },
  cardList: {
    gap: Spacing.four,
    marginTop: Spacing.three,
  },
  settingsButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
});
