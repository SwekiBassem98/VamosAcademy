import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BAND_B_THEME } from '../../theme/tokens.ts';

interface ContinueLearningCardProps {
  title?: string;
  subject?: string;
  moduleInfo?: string;
  progressPercent?: number;
  minutesRemaining?: number;
  onResume: () => void;
}

export function ContinueLearningCard({
  title = 'Quadratic Balance & Planetary Trajectory',
  subject = 'Math & Orbital Physics',
  moduleInfo = 'Mission 3 of 5 • Step 4: Parabolic Apex',
  progressPercent = 68,
  minutesRemaining = 6,
  onResume,
}: ContinueLearningCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.badgeRow}>
        <View style={styles.subjectBadge}>
          <Text style={styles.subjectText}>⚡ CONTINUE LEARNING</Text>
        </View>
        <Text style={styles.timeText}>⏱️ {minutesRemaining} min left</Text>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.moduleInfo}>{subject} • {moduleInfo}</Text>

      <View style={styles.progressRow}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.percentText}>{progressPercent}%</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onResume}
        style={styles.resumeButton}
      >
        <Text style={styles.resumeButtonText}>RESUME MISSION ➔</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    marginVertical: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subjectBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  subjectText: {
    fontSize: 10,
    fontWeight: '900',
    color: BAND_B_THEME.colors.primary,
    letterSpacing: 0.4,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  moduleInfo: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  track: {
    flex: 1,
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#06B6D4',
    borderRadius: 4,
  },
  percentText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#06B6D4',
    minWidth: 32,
    textAlign: 'right',
  },
  resumeButton: {
    backgroundColor: BAND_B_THEME.colors.primary,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BAND_B_THEME.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  resumeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
