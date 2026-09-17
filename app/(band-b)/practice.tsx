import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BAND_B_THEME } from '../../theme/tokens.ts';
import { MissionCard } from '../../components/band-b/MissionCard.tsx';
import { useProgressStore } from '../../store/progressStore.ts';

export default function BandBPracticeScreen() {
  const router = useRouter();
  const addXp = useProgressStore((s) => s.addXp);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>PRACTICE ARENA</Text>
        <Text style={styles.sub}>Structured challenges for Vanguard Cadets (Ages 10–13)</Text>
      </View>

      <View style={styles.filterRow}>
        {['All', 'Math & Logic', 'Science Lab', 'Languages', 'Coding'].map((cat, idx) => (
          <View key={cat} style={[styles.filterPill, idx === 0 && styles.filterPillActive]}>
            <Text style={[styles.filterPillText, idx === 0 && styles.filterPillTextActive]}>{cat}</Text>
          </View>
        ))}
      </View>

      <MissionCard
        title="Algebraic Fuel Balancer: Systems of Equations"
        category="Math & Logic"
        xpReward={75}
        progressPercent={65}
        onStart={() => addXp(75)}
      />

      <MissionCard
        title="Mediterranean Marine Ecosystems in 3D"
        category="Science Lab"
        xpReward={60}
        progressPercent={25}
        onStart={() => addXp(60)}
      />

      <MissionCard
        title="Speed Vocabulary: Tech & Robotics"
        category="Languages"
        xpReward={50}
        progressPercent={90}
        onStart={() => addXp(50)}
      />

      <MissionCard
        title="Logic Circuits & Python Loops"
        category="Coding"
        xpReward={80}
        progressPercent={10}
        onStart={() => addXp(80)}
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← RETURN TO HQ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BAND_B_THEME.colors.surface,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  sub: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterPillActive: {
    backgroundColor: BAND_B_THEME.colors.primary,
    borderColor: BAND_B_THEME.colors.primary,
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  backButton: {
    marginTop: 16,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: BAND_B_THEME.colors.primary,
  },
});
