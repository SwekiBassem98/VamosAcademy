import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { OriginalMascotView } from '../../components/band-a/OriginalMascotView.tsx';
import { ExplorerCard } from '../../components/band-a/ExplorerCard.tsx';
import { ExercisePlayer } from '../../components/shared/ExercisePlayer.tsx';
import { fetchExercisesForStudent } from '../../lib/exercises/api.ts';
import type { Exercise } from '../../lib/exercises/types.ts';
import { useProgressStore } from '../../store/progressStore.ts';
import { playTapSound } from '../../lib/soundEffects.ts';

export default function BandAExercises() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const starsCount = useProgressStore((s) => s.metrics.stars);

  useEffect(() => {
    fetchExercisesForStudent({
      band: 'BAND_A',
      subject: selectedSubject === 'ALL' ? undefined : selectedSubject,
      studentAcademicLevel: 2, // Academic Level 2: Explorer
    }).then(setExercises);
  }, [selectedSubject]);

  if (activeExercise) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ExercisePlayer
          exercise={activeExercise}
          studentId="student-band-a"
          onExit={() => {
            playTapSound();
            setActiveExercise(null);
          }}
          onFinished={() => {}}
        />
      </SafeAreaView>
    );
  }

  const subjects = [
    { code: 'ALL', label: '🌟 Toutes' },
    { code: 'MATH', label: '🔢 Maths' },
    { code: 'FRENCH', label: '🇫🇷 Français' },
    { code: 'SCIENCE', label: '🌿 Nature' },
    { code: 'ARABIC', label: '🇹🇳 العربية' },
  ];

  const handleSelectSubject = (code: string) => {
    playTapSound();
    setSelectedSubject(code);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Low-Chrome Top Activity Bar */}
      <View style={styles.topChromeBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            playTapSound();
            router.back();
          }}
          style={styles.largeBackButton}
          testID="exercises_back_button"
        >
          <Text style={styles.backEmoji}>⬅️</Text>
        </TouchableOpacity>

        <View style={styles.screenTitleBadge}>
          <Text style={styles.screenTitleEmoji}>🦌</Text>
          <Text style={styles.screenTitleText}>MISSIONS DE NOUR</Text>
        </View>

        <View style={styles.starsPill}>
          <Text style={styles.starsPillText}>⭐ {starsCount}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Nour the Gazelle Greeting */}
        <View style={styles.mascotArea}>
          <OriginalMascotView
            mascotId="nour"
            customDialogue="Découvrons ensemble de nouveaux défis ! Choisis ta mission 🌟"
            size="medium"
          />
        </View>

        {/* Subject Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
          contentContainerStyle={styles.filterRowContent}
        >
          {subjects.map((sub) => {
            const isSelected = selectedSubject === sub.code;
            return (
              <TouchableOpacity
                key={sub.code}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipSelected,
                ]}
                onPress={() => handleSelectSubject(sub.code)}
                activeOpacity={0.8}
                testID={`subject_chip_${sub.code}`}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextSelected,
                  ]}
                >
                  {sub.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Exercises List Cards */}
        <View style={styles.listSection}>
          {exercises.map((ex) => (
            <ExplorerCard
              key={ex.id}
              title={ex.title}
              emoji={
                ex.subject === 'MATH'
                  ? '🔢'
                  : ex.subject === 'FRENCH'
                  ? '📖'
                  : ex.subject === 'ARABIC'
                  ? '🌙'
                  : '🌿'
              }
              starsCount={ex.starsAwarded}
              duration={`${Math.round(ex.estimatedDurationSeconds / 60)} min`}
              onPress={() => {
                playTapSound();
                setActiveExercise(ex);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  topChromeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFDF9',
  },
  largeBackButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FDE2E6',
    borderBottomWidth: 4,
    borderBottomColor: '#F8B4BD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backEmoji: {
    fontSize: 20,
  },
  screenTitleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FEF3C7',
    gap: 6,
  },
  screenTitleEmoji: {
    fontSize: 16,
  },
  screenTitleText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: 0.6,
  },
  starsPill: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  starsPillText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#B45309',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  mascotArea: {
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    marginVertical: 12,
  },
  filterRowContent: {
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  filterChipSelected: {
    backgroundColor: '#D80027', // Club Africain Rouge Accent
    borderColor: '#D80027',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  listSection: {
    gap: 10,
    marginTop: 4,
  },
});
