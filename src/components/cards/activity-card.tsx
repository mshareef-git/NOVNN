import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Spacing, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ActivityCardProps = PressableProps & {
  title: string;
  description?: string;
  meta?: string;
  icon?: ReactNode;
  tint?: 'accent' | 'sage';
  rightLabel?: string;
  gradientColors?: readonly [string, string, ...string[]];
  isHero?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ActivityCard({
  title,
  description,
  meta,
  icon,
  tint = 'accent',
  rightLabel,
  gradientColors,
  isHero = false,
  disabled,
  style,
  ...rest
}: ActivityCardProps) {
  const theme = useTheme();

  const isGradient = Boolean(gradientColors && gradientColors.length >= 2);
  const titleColor = isHero ? '#FFFFFF' : theme.heading;
  const descriptionColor = isHero ? 'rgba(255, 255, 255, 0.85)' : theme.textSecondary;
  const metaColor = isHero ? 'rgba(255, 255, 255, 0.9)' : theme.accentSecondary;

  return (
    <Pressable
      accessibilityRole={disabled ? undefined : 'button'}
      disabled={disabled}
      style={({ pressed }) => [
        styles.card,
        isHero && styles.heroCard,
        {
          backgroundColor: isGradient ? undefined : theme.backgroundElement,
          borderColor: isHero ? 'transparent' : theme.border,
        },
        pressed && !disabled && styles.pressed,
        style,
      ]}
      {...rest}>
      {isGradient && gradientColors ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}

      {icon ? (
        <View
          style={[
            styles.iconHalo,
            {
              backgroundColor: isHero ? '#FFFFFF' : theme.background,
              shadowColor: isHero ? 'rgba(0,0,0,0.15)' : 'transparent',
            },
          ]}>
          {icon}
        </View>
      ) : null}

      <View style={styles.copy}>
        <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
        {description ? (
          <Text style={[styles.description, { color: descriptionColor }]}>{description}</Text>
        ) : null}
        {meta ? <Text style={[styles.meta, { color: metaColor }]}>{meta}</Text> : null}
      </View>

      {rightLabel ? (
        <View
          style={[
            styles.rightButtonPill,
            {
              backgroundColor: isHero ? 'rgba(255, 255, 255, 0.95)' : theme.accentStrong,
            },
          ]}>
          <Text
            style={[
              styles.rightButtonText,
              {
                color: isHero ? '#F37F46' : '#FFFFFF',
              },
            ]}>
            {rightLabel}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 28,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 96,
  },
  heroCard: {
    paddingVertical: 24,
    paddingHorizontal: 22,
    borderRadius: 32,
    borderWidth: 0,
    shadowColor: '#F37F46',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  iconHalo: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...Type.label,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  description: {
    ...Type.label,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500',
  },
  meta: {
    ...Type.label,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  rightButtonPill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0,0,0,0.12)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  rightButtonText: {
    ...Type.label,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
});
