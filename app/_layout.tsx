import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../theme/ThemeProvider.tsx';
import { LevelUpModal } from '../components/shared/LevelUpModal.tsx';
import { useUserStore } from '../store/userStore.ts';

function RootLayoutNav() {
  const { isDark, theme } = useTheme();
  const showLevelUpModal = useUserStore((s) => s.showLevelUpModal);
  const closeLevelUpModal = useUserStore((s) => s.closeLevelUpModal);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.surface },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(band-a)" />
        <Stack.Screen name="(band-b)" />
        <Stack.Screen name="(band-c)" />
        <Stack.Screen name="parent-portal" />
      </Stack>
      <LevelUpModal visible={showLevelUpModal} onDismiss={closeLevelUpModal} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider initialAge={8}>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
