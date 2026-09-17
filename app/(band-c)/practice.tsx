import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ExercisePlayer } from '../../components/shared/ExercisePlayer.tsx';
import { fetchExercisesForStudent } from '../../lib/exercises/api.ts';
import type { Exercise } from '../../lib/exercises/types.ts';
import { useProgressStore } from '../../store/progressStore.ts';

export default function BandCPracticeScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<number>(6); // Level 6: Baccalaureate Prep
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  const accuracyRate = useProgressStore((s) => s.metrics.accuracyRate);
  const bacReadiness = useProgressStore((s) => s.metrics.bacReadinessScore);

  useEffect(() => {
    fetchExercisesForStudent({
      band: 'BAND_C',
      subject: selectedSubject === 'ALL' ? undefined : selectedSubject,
      studentAcademicLevel: selectedLevel,
    }).then(setExercises);
  }, [selectedSubject, selectedLevel]);

  const bg = isDark ? '#090D16' : '#F8FAFC';
  const cardBg = isDark ? '#111827' : '#FFFFFF';
  const borderCol = isDark ? '#1F2937' : '#E2E8F0';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const accent = isDark ? '#38BDF8' : '#0284C7';

  if (activeExercise) {
    return (
      <ExercisePlayer
        exercise={activeExercise}
        studentId="student-band-c"
        onExit={() => setActiveExercise(null)}
        onFinished={() => {}}
      />
    );
  }

  const subjects = [
    { code: 'ALL', label: 'Toutes les épreuves' },
    { code: 'MATH', label: 'Mathématiques' },
    { code: 'SCIENCE', label: 'Physique-Chimie' },
    { code: 'PHILOSOPHY', label: 'Philosophie' },
  ];

  const levels = [
    { num: 5, label: 'Lycée Tronc Commun (Niveau 5)' },
    { num: 6, label: 'Bac National Tunisien (Niveau 6)' },
    { num: 7, label: 'Bac Pilote & Concours (Niveau 7)' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Top Header & Telemetry Bar */}
        <View style={styles.topHeader}>
          <View>
            <Text style={[styles.kicker, { color: accent }]}>
              BACCALAURÉAT TUNISIEN • MODULES D'ÉVALUATION
            </Text>
            <Text style={[styles.title, { color: textPrimary }]}>
              ÉPREUVES & EXERCICES RIGOUYEUX
            </Text>
          </View>
          <View style={styles.telemetryBadge}>
            <Text style={styles.telemetryAccuracy}>{accuracyRate}%</Text>
            <Text style={styles.telemetrySub}>Précision</Text>
          </View>
        </View>

        {/* Academic Level Selector (Not just age — student's actual assessed center level) */}
        <View style={[styles.levelSelectorBox, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <Text style={[styles.boxLabel, { color: textMuted }]}>
            NIVEAU ACADÉMIQUE AU CENTRE VAMOS :
          </Text>
          <View style={styles.levelPillsRow}>
            {levels.map((lvl) => {
              const isSelected = selectedLevel === lvl.num;
              return (
                <TouchableOpacity
                  key={lvl.num}
                  style={[
                    styles.levelPill,
                    { borderColor: isSelected ? accent : borderCol },
                    isSelected && { backgroundColor: isDark ? '#1E293B' : '#F0F9FF' },
                  ]}
                  onPress={() => setSelectedLevel(lvl.num)}
                >
                  <Text
                    style={[
                      styles.levelPillText,
                      { color: isSelected ? accent : textMuted, fontWeight: isSelected ? '800' : '600' },
                    ]}
                  >
                    {lvl.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Subject Filter Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectFilterRow}>
          {subjects.map((sub) => {
            const isSelected = selectedSubject === sub.code;
            return (
              <TouchableOpacity
                key={sub.code}
                style={[
                  styles.subjectChip,
                  { borderColor: borderCol, backgroundColor: isSelected ? (isDark ? '#0284C7' : '#0F172A') : cardBg },
                ]}
                onPress={() => setSelectedSubject(sub.code)}
              >
                <Text
                  style={[
                    styles.subjectChipText,
                    { color: isSelected ? '#FFFFFF' : textMuted, fontWeight: isSelected ? '700' : '500' },
                  ]}
                >
                  {sub.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Exercises List */}
        <View style={styles.listSection}>
          {exercises.map((ex) => (
            <View
              key={ex.id}
              style={[styles.exerciseCard, { backgroundColor: cardBg, borderColor: borderCol }]}
            >
              <View style={styles.cardTopRow}>
                <Text style={[styles.cardSubject, { color: accent }]}>
                  {ex.subject} • {ex.levelCode}
                </Text>
                <Text style={[styles.cardType, { color: textMuted }]}>
                  {ex.exerciseType.replace(/_/g, ' ')}
                </Text>
              </View>

              <Text style={[styles.cardTitle, { color: textPrimary }]}>{ex.title}</Text>
              <Text style={[styles.cardPrompt, { color: textMuted }]} numberOfLines={2}>
                {ex.prompt}
              </Text>

              <View style={styles.cardBottomRow}>
                <Text style={[styles.cardMeta, { color: textMuted }]}>
                  ⏱ {Math.round(ex.estimatedDurationSeconds / 60)} min • Barème : {ex.points} pts
                </Text>
                <TouchableOpacity
                  style={[styles.startBtn, { backgroundColor: isDark ? '#0284C7' : '#0F172A' }]}
                  onPress={() => setActiveExercise(ex)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.startBtnText}>Résoudre l'exercice ➔</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { borderColor: borderCol }]}
        >
          <Text style={[styles.backBtnText, { color: textPrimary }]}>← Retour au Dossier</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  kicker: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  telemetryBadge: {
    alignItems: 'flex-end',
  },
  telemetryAccuracy: {
    fontSize: 18,
    fontWeight: '900',
    color: '#059669',
  },
  telemetrySub: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  levelSelectorBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
  },
  boxLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  levelPillsRow: {
    gap: 6,
  },
  levelPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  levelPillText: {
    fontSize: 11,
  },
  subjectFilterRow: {
    marginBottom: 12,
  },
  subjectChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 8,
  },
  subjectChipText: {
    fontSize: 11,
  },
  listSection: {
    gap: 10,
  },
  exerciseCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardSubject: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  cardType: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardPrompt: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.4)',
  },
  cardMeta: {
    fontSize: 10,
    fontWeight: '600',
  },
  startBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  backBtn: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  backBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
