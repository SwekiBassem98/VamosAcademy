import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { ScholarStatsDashboard } from '../../components/band-c/ScholarStatsDashboard.tsx';
import { MasteryRadar } from '../../components/band-c/MasteryRadar.tsx';
import { useProgressStore } from '../../store/progressStore.ts';

export default function BandCStatsScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const { accuracyRate, bacReadinessScore } = useProgressStore((s) => s.metrics);

  const bg = isDark ? '#090D16' : '#F8FAFC';
  const cardBg = isDark ? '#111827' : '#FFFFFF';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderCol = isDark ? '#1F2937' : '#E2E8F0';
  const accent = isDark ? '#38BDF8' : '#0284C7';

  const MASTERY_DATA = [
    { subject: 'Advanced Mathematics (Mathématiques)', percentage: 88 },
    { subject: 'Experimental Sciences & Physics', percentage: 76 },
    { subject: 'Computer Science & Algorithms', percentage: 94 },
    { subject: 'French & Philosophy Synthesis', percentage: 82 },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: textPrimary }]}>PERFORMANCE ANALYTICS</Text>
      <Text style={[styles.subtitle, { color: textMuted }]}>
        Telemetry, accuracy trends, and national examination readiness
      </Text>

      <ScholarStatsDashboard
        timeStudiedHours={14.8}
        timeTargetHours={18.0}
        accuracyPercent={accuracyRate || 94.2}
        streakDays={18}
        isDark={isDark}
      />

      <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderCol }]}>
        <Text style={[styles.cardTitle, { color: textPrimary }]}>BACCALAUREATE READINESS SCORE</Text>
        <Text style={[styles.cardVal, { color: accent }]}>{bacReadinessScore || 84}%</Text>
        <Text style={[styles.cardDesc, { color: textMuted }]}>
          Composite metric factoring difficulty weighting, speed under exam time conditions, and consistency across core academic subjects.
        </Text>
      </View>

      <MasteryRadar items={MASTERY_DATA} />

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
    padding: 16,
    marginVertical: 8,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  cardVal: {
    fontSize: 36,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    marginVertical: 4,
  },
  cardDesc: {
    fontSize: 12,
    lineHeight: 18,
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
