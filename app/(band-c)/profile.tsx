import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../../store/userStore.ts';
import { useProgressStore } from '../../store/progressStore.ts';

export default function BandCProfileScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const student = useUserStore((s) => s.student);
  const { xp, currentLevel, streakDays } = useProgressStore((s) => s.metrics);

  const bg = isDark ? '#090D16' : '#F8FAFC';
  const cardBg = isDark ? '#111827' : '#FFFFFF';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderCol = isDark ? '#1F2937' : '#E2E8F0';
  const accent = isDark ? '#38BDF8' : '#0284C7';

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: textPrimary }]}>SCHOLAR DOSSIER</Text>
      <Text style={[styles.subtitle, { color: textMuted }]}>
        Candidate registry, credentials and academic honors
      </Text>

      <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderCol }]}>
        <View style={[styles.avatarBox, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9', borderColor: borderCol }]}>
          <Text style={styles.avatarEmoji}>🏛️</Text>
        </View>
        <Text style={[styles.name, { color: textPrimary }]}>{student?.fullName || 'Senior Scholar Bassem'}</Text>
        <Text style={[styles.stream, { color: accent }]}>
          Baccalaureate Candidate • Section Mathématiques & Informatique
        </Text>
        <Text style={[styles.school, { color: textMuted }]}>
          Lycée Pilote de Sousse • Candidate #2024-TN-8419
        </Text>
      </View>

      <View style={[styles.statsGrid, { backgroundColor: cardBg, borderColor: borderCol }]}>
        <Text style={[styles.gridTitle, { color: textMuted }]}>ACADEMIC RECORD</Text>
        <View style={styles.gridRow}>
          <View style={styles.gridCol}>
            <Text style={[styles.gridVal, { color: textPrimary }]}>{xp}</Text>
            <Text style={[styles.gridLbl, { color: textMuted }]}>STUDY POINTS</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={[styles.gridVal, { color: textPrimary }]}>{streakDays}d</Text>
            <Text style={[styles.gridLbl, { color: textMuted }]}>DAILY STREAK</Text>
          </View>
          <View style={styles.gridCol}>
            <Text style={[styles.gridVal, { color: textPrimary }]}>Level {currentLevel}</Text>
            <Text style={[styles.gridLbl, { color: textMuted }]}>FELLOW TIER</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.backBtn, { borderColor: borderCol }]}
      >
        <Text style={[styles.backBtnText, { color: textPrimary }]}>← Return to Overview</Text>
      </TouchableOpacity>
    </ScrollView>
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  stream: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  school: {
    fontSize: 12,
    marginTop: 4,
  },
  statsGrid: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  gridTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridCol: {
    alignItems: 'center',
  },
  gridVal: {
    fontSize: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  gridLbl: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  backBtn: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
