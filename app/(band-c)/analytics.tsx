import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { BAND_C_THEME } from '../../theme/tokens.ts';
import { ScholarStatCard } from '../../components/band-c/ScholarStatCard.tsx';
import { MasteryRadar } from '../../components/band-c/MasteryRadar.tsx';

export default function BandCAnalytics() {
  const PERFORMANCE_BREAKDOWN = [
    { subject: 'Algebra & Analysis', percentage: 92 },
    { subject: 'Geometry & Vectors', percentage: 84 },
    { subject: 'Probability & Statistics', percentage: 79 },
    { subject: 'Thermodynamics & Optics', percentage: 89 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>COGNITIVE & EXAM READINESS AUDIT</Text>

      <View style={styles.statsGrid}>
        <ScholarStatCard label="Study Time" value="48.5 hrs" subtext="Past 30 days" />
        <ScholarStatCard label="Mock Score" value="16.7 / 20" subtext="National Scale" trendPositive trend="+1.2 pts" />
      </View>

      <MasteryRadar items={PERFORMANCE_BREAKDOWN} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BAND_C_THEME.colors.surface,
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 11,
    fontWeight: '700',
    color: BAND_C_THEME.colors.textMuted,
    marginVertical: 12,
    letterSpacing: 0.8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
});
