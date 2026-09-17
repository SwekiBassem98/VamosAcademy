import React from 'react';
import { Stack } from 'expo-router';
import { BAND_B_THEME } from '../../theme/tokens.ts';

export default function BandBLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: BAND_B_THEME.colors.surfaceElevated },
        headerTintColor: BAND_B_THEME.colors.primary,
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
      }}
    >
      <Stack.Screen name="index" options={{ title: '⚡ Vamos Vanguard HQ' }} />
      <Stack.Screen name="practice" options={{ title: '🎯 Arena Practice' }} />
      <Stack.Screen name="games" options={{ title: '🎮 Games Arena' }} />
      <Stack.Screen name="leaderboard" options={{ title: '🏆 Class Leaderboard' }} />
      <Stack.Screen name="profile" options={{ title: '👤 Cadet Profile' }} />
      <Stack.Screen name="exercises" options={{ title: '🎯 Arena Missions' }} />
      <Stack.Screen name="guilds" options={{ title: '🛡️ Guild Battles' }} />
    </Stack>
  );
}
