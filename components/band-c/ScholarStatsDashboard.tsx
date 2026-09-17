import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScholarStatsDashboardProps {
  timeStudiedHours?: number;
  timeTargetHours?: number;
  accuracyPercent?: number;
  streakDays?: number;
  isDark?: boolean;
}

export function ScholarStatsDashboard({
  timeStudiedHours = 14.8,
  timeTargetHours = 18.0,
  accuracyPercent = 94.2,
  streakDays = 18,
  isDark = false,
}: ScholarStatsDashboardProps) {
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const borderCol = isDark ? '#334155' : '#E2E8F0';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const accent = isDark ? '#38BDF8' : '#0284C7';
  const surfaceSubtle = isDark ? '#0F172A' : '#F8FAFC';

  const dailyAccuracy = [
    { day: 'M', val: 92 },
    { day: 'T', val: 95 },
    { day: 'W', val: 96 },
    { day: 'T', val: 94 },
    { day: 'F', val: 98 },
    { day: 'S', val: 91 },
    { day: 'S', val: 94 },
  ];

  const timeProgress = Math.min(1, timeStudiedHours / timeTargetHours);

  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderColor: borderCol }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: textMuted }]}>STUDY METRICS & TRENDS</Text>
        <Text style={[styles.periodTag, { color: textMuted }]}>This Week (Week 37)</Text>
      </View>

      {/* 3 Core Metric Tiles */}
      <View style={styles.metricsRow}>
        {/* Metric 1: Time Studied */}
        <View style={[styles.metricTile, { backgroundColor: surfaceSubtle, borderColor: borderCol }]}>
          <Text style={[styles.tileLabel, { color: textMuted }]}>TIME STUDIED</Text>
          <View style={styles.tileValRow}>
            <Text style={[styles.tileValue, { color: textPrimary }]}>{timeStudiedHours}</Text>
            <Text style={[styles.tileUnit, { color: textMuted }]}>hrs</Text>
          </View>
          <Text style={[styles.tileDelta, { color: '#10B981' }]}>+2.4h vs last wk</Text>
          <View style={[styles.progressBarBg, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]}>
            <View style={[styles.progressBarFill, { width: `${timeProgress * 100}%`, backgroundColor: accent }]} />
          </View>
          <Text style={[styles.tileTarget, { color: textMuted }]}>Goal: {timeTargetHours}h</Text>
        </View>

        {/* Metric 2: Accuracy Trend */}
        <View style={[styles.metricTile, { backgroundColor: surfaceSubtle, borderColor: borderCol }]}>
          <Text style={[styles.tileLabel, { color: textMuted }]}>ACCURACY</Text>
          <View style={styles.tileValRow}>
            <Text style={[styles.tileValue, { color: textPrimary }]}>{accuracyPercent}</Text>
            <Text style={[styles.tileUnit, { color: textMuted }]}>%</Text>
          </View>
          <Text style={[styles.tileDelta, { color: '#10B981' }]}>+1.8% vs last wk</Text>

          {/* 7-day sparkline bars */}
          <View style={styles.sparkRow}>
            {dailyAccuracy.map((d, i) => {
              const h = Math.max(6, ((d.val - 80) / 20) * 22);
              return (
                <View key={i} style={styles.sparkCol}>
                  <View
                    style={[
                      styles.sparkBar,
                      {
                        height: h,
                        backgroundColor: i === dailyAccuracy.length - 1 ? accent : isDark ? '#475569' : '#CBD5E1',
                      },
                    ]}
                  />
                  <Text style={[styles.sparkDay, { color: textMuted }]}>{d.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Metric 3: Streak */}
        <View style={[styles.metricTile, { backgroundColor: surfaceSubtle, borderColor: borderCol }]}>
          <Text style={[styles.tileLabel, { color: textMuted }]}>STUDY STREAK</Text>
          <View style={styles.tileValRow}>
            <Text style={[styles.tileValue, { color: textPrimary }]}>{streakDays}</Text>
            <Text style={[styles.tileUnit, { color: textMuted }]}>days</Text>
          </View>
          <Text style={[styles.tileDelta, { color: isDark ? '#F59E0B' : '#D97706' }]}>Personal best</Text>
          <View style={styles.streakIndicator}>
            <Text style={styles.streakFlame}>🔥</Text>
            <Text style={[styles.streakStatus, { color: textMuted }]}>Active today</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  periodTag: {
    fontSize: 11,
    fontWeight: '500',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metricTile: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  tileLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  tileValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  tileValue: {
    fontSize: 20,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  tileUnit: {
    fontSize: 11,
    fontWeight: '600',
  },
  tileDelta: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 6,
  },
  progressBarBg: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  tileTarget: {
    fontSize: 9,
    fontWeight: '500',
    marginTop: 4,
  },
  sparkRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 32,
    marginTop: 2,
  },
  sparkCol: {
    alignItems: 'center',
    gap: 2,
  },
  sparkBar: {
    width: 5,
    borderRadius: 2,
  },
  sparkDay: {
    fontSize: 8,
    fontWeight: '600',
  },
  streakIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  streakFlame: {
    fontSize: 14,
  },
  streakStatus: {
    fontSize: 9,
    fontWeight: '600',
  },
});
