import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../store/userStore.ts';
import { useTheme } from '../theme/ThemeProvider.tsx';
import { BrandedSplashScreen } from '../components/entry/BrandedSplashScreen.tsx';
import { GuidedTour } from '../components/entry/GuidedTour.tsx';
import { AuthChoiceScreen } from '../components/entry/AuthChoiceScreen.tsx';

type EntryPhase = 'splash' | 'tour' | 'choice' | 'redirecting';

export default function AppEntry() {
  const router = useRouter();
  const { isAuthenticated, activeRole, hasSeenOnboarding, setOnboardingSeen, setParentUser } = useUserStore();
  const { details } = useTheme();

  // Phase state machine: always start with splash screen on cold start
  const [phase, setPhase] = useState<EntryPhase>('splash');

  const handleSplashFinish = () => {
    // Check if user is already authenticated
    if (isAuthenticated) {
      setPhase('redirecting');
      if (activeRole === 'parent') {
        router.replace('/parent-portal' as any);
      } else {
        router.replace(details.routePrefix as any);
      }
      return;
    }

    // Unauthenticated: check if first launch or tour already completed
    if (!hasSeenOnboarding) {
      setPhase('tour');
    } else {
      setPhase('choice');
    }
  };

  const handleTourComplete = () => {
    setOnboardingSeen();
    setPhase('choice');
  };

  const handleSelectStudent = () => {
    router.push('/(auth)/sign-in' as any);
  };

  const handleSelectParent = () => {
    setParentUser();
    router.replace('/parent-portal' as any);
  };

  if (phase === 'splash') {
    return <BrandedSplashScreen onFinish={handleSplashFinish} durationMs={2000} />;
  }

  if (phase === 'tour') {
    return <GuidedTour onComplete={handleTourComplete} />;
  }

  if (phase === 'choice') {
    return (
      <AuthChoiceScreen
        onSelectStudent={handleSelectStudent}
        onSelectParent={handleSelectParent}
      />
    );
  }

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
});
