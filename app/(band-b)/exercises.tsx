import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { BAND_B_THEME } from '../../theme/tokens.ts';
import { MissionCard } from '../../components/band-b/MissionCard.tsx';
import { ExercisePlayer } from '../../components/shared/ExercisePlayer.tsx';
import { fetchExercisesForStudent } from '../../lib/exercises/api.ts';
import type { Exercise } from '../../lib/exercises/types.ts';
import { useProgressStore } from '../../store/progressStore.ts';

export default function BandBExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  const xp = useProgressStore((s) => s.metrics.xp);
  const streak = useProgressStore((s) => s.metrics.streakDays);

  useEffect(() => {
    fetchExercisesForStudent({
      band: 'BAND_B',
      subject: selectedSubject === 'ALL' ? undefined : selectedSubject,
      studentAcademicLevel: 4, // Academic Level 4: Vanguard Collège Pilote
    }).then(setExercises);
  }, [selectedSubject]);

  if (activeExercise) {
    return (
      <ExercisePlayer
        exercise={activeExercise}
        studentId="student-band-b"
        onExit={() => setActiveExercise(null)}
        onFinished={() => {}}
      />
    );
  }

  const subjects = [
    { code: 'ALL', label: 'All Sectors' },
    { code: 'MATH', label: 'Math & Logic' },
    { code: 'INFORMATIQUE', label: 'Python & Algo' },
    { code: 'SCIENCE', label: 'Sciences & Physics' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Banner with Vanguard Level & Telemetry */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.centerLevelTag}>VANGUARD ACADEMIC TRACK • LEVEL 4 (COLLÈGE)</Text>
          <Text style={styles.header}>ACTIVE MISSION LOG</Text>
        </View>
        <View style={styles.telemetryRow}>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {streak}d</Text>
          </View>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>⚡ {xp} XP</Text>
          </View>
        </View>
      </View>

      {/* Sector / Subject Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {subjects.map((sub) => {
          const isSelected = selectedSubject === sub.code;
          return (
            <TouchableOpacity
              key={sub.code}
              style={[styles.filterChip, isSelected && styles.filterChipSelected]}
              onPress={() => setSelectedSubject(sub.code)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
                {sub.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Mission List */}
      <View style={styles.listSection}>
        {exercises.map((ex) => (
          <MissionCard
            key={ex.id}
            title={ex.title}
            category={`${ex.subject} • ${ex.exerciseType.replace(/_/g, ' ')}`}
            xpReward={ex.xpAwarded}
            progressPercent={ex.points * 3}
            onStart={() => setActiveExercise(ex)}
          />
        ))}
      </View>
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
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  centerLevelTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.8,
  },
  header: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  telemetryRow: {
    flexDirection: 'row',
    gap: 6,
  },
  streakBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  streakText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FBBF24',
  },
  xpBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  xpText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
  },
  filterRow: {
    marginBottom: 14,
  },
  filterChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterChipSelected: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  listSection: {
    gap: 10,
  },
});
