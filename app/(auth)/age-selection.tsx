import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme/ThemeProvider.tsx';
import { ThemedText } from '../../components/shared/ThemedText.tsx';
import { ThemedButton } from '../../components/shared/ThemedButton.tsx';
import { ThemedCard } from '../../components/shared/ThemedCard.tsx';
import { useUserStore } from '../../store/userStore.ts';
import { resolveAgeBand, resolveAgeBandDetails } from '../../lib/themeResolver.ts';

const AGES = Array.from({ length: 14 }, (_, i) => i + 6); // 6 to 19

export default function AgeSelectionScreen() {
  const router = useRouter();
  const { theme, setStudentAge } = useTheme();
  const [selectedAge, setSelectedAge] = useState<number>(8);
  const setGuestStudent = useUserStore((s) => s.setGuestStudent);

  const previewDetails = resolveAgeBandDetails(selectedAge);

  const handleAgeClick = (age: number) => {
    setSelectedAge(age);
    setStudentAge(age);
  };

  const handleConfirm = () => {
    setGuestStudent(selectedAge, `Vamos Scholar ${selectedAge}`);
    router.replace(previewDetails.routePrefix as any);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      contentContainerStyle={styles.content}
    >
      <ThemedText variant="heading1" style={{ color: theme.colors.primary, textAlign: 'center' }}>
        Welcome to Vamos Academy
      </ThemedText>
      <ThemedText
        variant="bodyLarge"
        style={{ color: theme.colors.textMuted, textAlign: 'center', marginVertical: 8 }}
      >
        How old are you? We configure your learning universe automatically.
      </ThemedText>

      <ThemedCard style={styles.previewCard}>
        <View style={styles.rowBetween}>
          <ThemedText variant="label" style={{ color: previewDetails.theme.colors.primary }}>
            TARGET BAND:
          </ThemedText>
          <View
            style={[
              styles.bandChip,
              { backgroundColor: previewDetails.theme.colors.primaryContainer },
            ]}
          >
            <ThemedText
              variant="label"
              style={{ color: previewDetails.theme.colors.primary, fontSize: 13 }}
            >
              {previewDetails.displayName} ({previewDetails.theme.targetAgeLabel})
            </ThemedText>
          </View>
        </View>

        <ThemedText
          variant="heading2"
          style={{ color: previewDetails.theme.colors.textPrimary, marginVertical: 8 }}
        >
          Companion: {previewDetails.theme.mascot.name}
        </ThemedText>

        <ThemedText variant="bodyRegular" style={{ color: previewDetails.theme.colors.textMuted }}>
          {selectedAge <= 9
            ? '✨ Star rewards, 3D tactile buttons, playful micro-quests, minimal reading required.'
            : selectedAge <= 13
            ? '⚡ XP leagues, guild challenges, avatar progression, and competitive games.'
            : '🏛️ Deep-work Pomodoro drills, Tunisian Baccalaureate exam prep, and mastery curves.'}
        </ThemedText>
      </ThemedCard>

      <ThemedText variant="label" style={{ marginVertical: 12, color: theme.colors.textPrimary }}>
        SELECT STUDENT AGE (6–19):
      </ThemedText>

      <View style={styles.grid}>
        {AGES.map((age) => {
          const isSelected = age === selectedAge;
          const band = resolveAgeBand(age);
          const badgeColor =
            band === 'BAND_A' ? '#FF6B4A' : band === 'BAND_B' ? '#4F46E5' : '#0F172A';

          return (
            <TouchableOpacity
              key={age}
              activeOpacity={0.8}
              onPress={() => handleAgeClick(age)}
              style={[
                styles.ageTile,
                {
                  backgroundColor: isSelected ? badgeColor : '#FFFFFF',
                  borderColor: isSelected ? badgeColor : '#E2E8F0',
                },
              ]}
            >
              <ThemedText
                variant="heading2"
                style={{
                  color: isSelected ? '#FFFFFF' : '#0F172A',
                }}
              >
                {age}
              </ThemedText>
              <ThemedText
                variant="label"
                style={{
                  color: isSelected ? '#FFFFFF' : '#64748B',
                  fontSize: 10,
                }}
              >
                {band === 'BAND_A' ? 'BAND A' : band === 'BAND_B' ? 'BAND B' : 'BAND C'}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>

      <ThemedButton
        title={`Enter ${previewDetails.displayName} (Age ${selectedAge}) →`}
        size="large"
        onPress={handleConfirm}
        style={{ marginTop: 24 }}
      />
      
      <ThemedButton
        title="Already have a Center Account? Sign In"
        variant="outline"
        onPress={() => router.push('/(auth)/sign-in' as any)}
        style={{ marginTop: 10 }}
      />

      <ThemedButton
        title="🛡️ Parent & Center Director Portal (Read-Only)"
        variant="secondary"
        onPress={() => router.push('/parent-portal' as any)}
        style={{ marginTop: 10 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 48,
    paddingBottom: 40,
  },
  previewCard: {
    marginVertical: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bandChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  ageTile: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
