import React from 'react';
import { Stack } from 'expo-router';
import { BAND_C_THEME } from '../../theme/tokens.ts';

export default function BandCLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: BAND_C_THEME.colors.surfaceElevated },
        headerTintColor: BAND_C_THEME.colors.textPrimary,
        headerTitleStyle: { fontWeight: '700', fontSize: 16 },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Vamos Academy — Scholars' }} />
      <Stack.Screen name="practice" options={{ title: 'Academic Practice' }} />
      <Stack.Screen name="games" options={{ title: 'Cognitive & Logic Drills' }} />
      <Stack.Screen name="stats" options={{ title: 'Performance Analytics' }} />
      <Stack.Screen name="profile" options={{ title: 'Scholar Dossier' }} />
      <Stack.Screen name="analytics" options={{ title: 'Mastery & Performance Analytics' }} />
      <Stack.Screen name="prep" options={{ title: 'Tunisian Baccalaureate Module' }} />
    </Stack>
  );
}
