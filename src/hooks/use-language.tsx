import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type Language = 'en' | 'kn';

export const TRANSLATIONS = {
  en: {
    appName: 'NOVEN',
    welcomeHome: 'Welcome Home',
    exercise: 'Exercise',
    yoga: 'Yoga',
    meditation: 'Meditation',
    start: 'Start',
    preview: 'Preview',
    home: 'Home',
    progress: 'Progress',
    family: 'Family',
    settings: 'Settings',
    appearance: 'Appearance',
    language: 'Language',
    currentLanguage: 'Current language',
    english: 'English',
    kannada: 'ಕನ್ನಡ',
    light: 'Light',
    dark: 'Dark',
    system: 'Same as my phone',
    selected: 'Selected',
    todaysExercises: "Today's Exercises",
    exerciseSubtitle: '3 simple daily movements. Preview the movement or start directly.',
    seatedKneeExtension: 'Seated Knee Extension',
    seatedArmRaise: 'Seated Arm Raise',
    sitToStand: 'Sit-to-Stand',
    startExercise: 'Start Exercise',
    close: 'Close',
    ready: 'Ready',
    steadyPace: 'STEADY PACE',
    hold: 'HOLD',
    release: 'RELEASE',
    greatJob: 'GREAT JOB!',
    repCelebration: '+1 REP!',
    set: 'SET',
    reps: 'REPS',
  },
  kn: {
    appName: 'ನೋವೆನ್',
    welcomeHome: 'ಸುಸ್ವಾಗತ',
    exercise: 'ವ್ಯಾಯಾಮ',
    yoga: 'ಯೋಗ',
    meditation: 'ಧ್ಯಾನ',
    start: 'ಪ್ರಾರಂಭಿಸಿ',
    preview: 'ಮುನ್ನೋಟ',
    home: 'ಮುಖಪುಟ',
    progress: 'ಪ್ರಗತಿ',
    family: 'ಕುಟುಂಬ',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    appearance: 'ಗೋಚರತೆ',
    language: 'ಭಾಷೆ',
    currentLanguage: 'ಪ್ರಸ್ತುತ ಭಾಷೆ',
    english: 'English',
    kannada: 'ಕನ್ನಡ',
    light: 'ತಿಳಿ ಬಣ್ಣ',
    dark: 'ಗಾಢ ಬಣ್ಣ',
    system: 'ಫೋನ್ ಸೆಟ್ಟಿಂಗ್‌ನಂತೆ',
    selected: 'ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ',
    todaysExercises: 'ಇಂದಿನ ವ್ಯಾಯಾಮಗಳು',
    exerciseSubtitle: '3 ಸರಳ ದೈನಂದಿನ ಚಲನೆಗಳು. ಮುನ್ನೋಟ ವೀಕ್ಷಿಸಿ ಅಥವಾ ನೇರವಾಗಿ ಪ್ರಾರಂಭಿಸಿ.',
    seatedKneeExtension: 'ಕುಳಿತು ಮೊಣಕಾಲು ಚಾಚುವುದು',
    seatedArmRaise: 'ಕುಳಿತು ಕೈ ಎತ್ತುವುದು',
    sitToStand: 'ಕುಳಿತು ಏಳುವುದು',
    startExercise: 'ವ್ಯಾಯಾಮ ಪ್ರಾರಂಭಿಸಿ',
    close: 'ಮುಚ್ಚಿ',
    ready: 'ಸಿದ್ಧ',
    steadyPace: 'ಸ್ಥಿರ ವೇಗ',
    hold: 'ಹಿಡಿದುಕೊಳ್ಳಿ',
    release: 'ಬಿಡಿ',
    greatJob: 'ಉತ್ತಮ ಕೆಲಸ!',
    repCelebration: '+1 ಪುನರಾವರ್ತನೆ!',
    set: 'ಸೆಟ್',
    reps: 'ಪುನರಾವರ್ತನೆಗಳು',
  },
} as const;

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS.en) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => TRANSLATIONS.en[key] || String(key),
});

const STORAGE_KEY = '@noven_language_preference';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved === 'en' || saved === 'kn') {
        setLanguageState(saved);
      }
    }).catch(() => {});
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY, lang).catch(() => {});
  };

  const t = useMemo(() => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return (key: keyof typeof TRANSLATIONS.en): string => {
      return (dict as Record<string, string>)[key] || TRANSLATIONS.en[key] || String(key);
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
