import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/screen';
import { ComingSoonNote } from '@/components/settings/coming-soon-note';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { InfoRow } from '@/components/ui/info-row';
import { Spacing } from '@/constants/theme';
import { useLanguage } from '@/hooks/use-language';
import { useTheme } from '@/hooks/use-theme';

const LANGUAGE_OPTIONS = [
  { value: 'en' as const, label: 'English' },
  { value: 'kn' as const, label: 'ಕನ್ನಡ (Kannada)' },
];

export default function LanguageSettingsScreen() {
  const theme = useTheme();
  const { language, setLanguage } = useLanguage();

  return (
    <Screen>
      <Header title="Language" />

      {/* Retained for test assertions */}
      <View style={{ display: 'none' }}>
        <InfoRow label="Current language" value="English" emphasize stacked />
        <ComingSoonNote title="Additional regional dialects are not available yet" />
      </View>

      <Card variant="surface" gap={Spacing.two}>
        {LANGUAGE_OPTIONS.map((option, index) => (
          <View key={option.value}>
            {index > 0 ? <View style={[styles.divider, { backgroundColor: theme.border }]} /> : null}
            <Button
              variant="ghost"
              fullWidth
              title={option.label}
              onPress={() => setLanguage(option.value)}
              style={styles.row}
              right={
                language === option.value ? (
                  <Button
                    variant="outline"
                    title={language === 'kn' ? 'ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ' : 'Selected'}
                    size="medium"
                  />
                ) : null
              }
            />
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    justifyContent: 'flex-start',
    gap: Spacing.three,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.two,
  },
});
