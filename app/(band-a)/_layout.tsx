import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BAND_A_THEME } from '../../theme/tokens.ts';

function LargeBackButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.back()}
      style={styles.backButton}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
      <Text style={styles.backEmoji}>⬅️</Text>
      <Text style={styles.backText}>BACK</Text>
    </TouchableOpacity>
  );
}

export default function BandALayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFDF9' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="practice"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="games"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="stars"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="progress"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="exercises"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F2D8D0',
    borderBottomWidth: 3,
    borderBottomColor: '#E6C6BD',
    marginRight: 10,
    minHeight: 48,
    gap: 4,
  },
  backEmoji: {
    fontSize: 18,
  },
  backText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FF6B4A',
    letterSpacing: 0.5,
  },
});
