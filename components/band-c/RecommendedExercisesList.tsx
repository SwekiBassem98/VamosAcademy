import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export interface ExerciseItem {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  priority: 'High' | 'Recommended' | 'Review' | 'New';
  progress?: number;
}

interface RecommendedExercisesListProps {
  onSelectExercise: (ex: ExerciseItem, startFocus?: boolean) => void;
  isDark?: boolean;
}

const DEFAULT_EXERCISES: ExerciseItem[] = [
  {
    id: 'bac-math-1',
    title: 'Differential Equations & Exponential Systems',
    subject: 'Mathématiques (Bac)',
    durationMinutes: 25,
    priority: 'High',
    progress: 40,
  },
  {
    id: 'bac-phy-2',
    title: 'RLC Oscillating Circuits & Resonance Curves',
    subject: 'Physique & Chimie',
    durationMinutes: 20,
    priority: 'Recommended',
    progress: 0,
  },
  {
    id: 'bac-philo-3',
    title: 'Autonomy, Justice & The Rule of Law',
    subject: 'Philosophie',
    durationMinutes: 30,
    priority: 'Review',
    progress: 75,
  },
  {
    id: 'bac-cs-4',
    title: 'Dynamic Programming & Matrix Optimization',
    subject: 'Informatique',
    durationMinutes: 15,
    priority: 'New',
    progress: 0,
  },
];

export function RecommendedExercisesList({
  onSelectExercise,
  isDark = false,
}: RecommendedExercisesListProps) {
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const borderCol = isDark ? '#334155' : '#E2E8F0';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const accent = isDark ? '#38BDF8' : '#0284C7';

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: textMuted }]}>
          RECOMMENDED EXERCISES
        </Text>
        <Text style={[styles.countBadge, { color: textMuted }]}>
          {DEFAULT_EXERCISES.length} modules queued
        </Text>
      </View>

      <View style={styles.list}>
        {DEFAULT_EXERCISES.map((item) => {
          const priorityColor =
            item.priority === 'High'
              ? isDark ? '#F87171' : '#DC2626'
              : item.priority === 'Recommended'
              ? isDark ? '#60A5FA' : '#2563EB'
              : item.priority === 'Review'
              ? isDark ? '#FBBF24' : '#D97706'
              : isDark ? '#34D399' : '#059669';

          const priorityBg =
            item.priority === 'High'
              ? isDark ? 'rgba(248, 113, 113, 0.15)' : '#FEF2F2'
              : item.priority === 'Recommended'
              ? isDark ? 'rgba(96, 165, 250, 0.15)' : '#EFF6FF'
              : item.priority === 'Review'
              ? isDark ? 'rgba(251, 191, 36, 0.15)' : '#FFFBEB'
              : isDark ? 'rgba(52, 211, 153, 0.15)' : '#ECFDF5';

          return (
            <View
              key={item.id}
              style={[styles.itemCard, { backgroundColor: cardBg, borderColor: borderCol }]}
            >
              <View style={styles.topRow}>
                <View style={styles.subjectRow}>
                  <Text style={[styles.subjectText, { color: textMuted }]}>{item.subject}</Text>
                  <View style={[styles.priorityPill, { backgroundColor: priorityBg }]}>
                    <Text style={[styles.priorityText, { color: priorityColor }]}>
                      {item.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.durationText, { color: textMuted }]}>
                  ⏱ {item.durationMinutes} min
                </Text>
              </View>

              <Text style={[styles.itemTitle, { color: textPrimary }]}>{item.title}</Text>

              {item.progress !== undefined && item.progress > 0 && (
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBarTrack, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${item.progress}%`, backgroundColor: accent },
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressPercent, { color: textMuted }]}>
                    {item.progress}% complete
                  </Text>
                </View>
              )}

              <View style={[styles.actionsRow, { borderTopColor: isDark ? '#334155' : '#F1F5F9' }]}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => onSelectExercise(item, true)}
                  style={[styles.focusAction, { borderColor: isDark ? '#475569' : '#CBD5E1' }]}
                >
                  <Text style={[styles.focusActionText, { color: textPrimary }]}>
                    ⚡ Focus Session
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => onSelectExercise(item, false)}
                  style={[styles.startAction, { backgroundColor: isDark ? '#0284C7' : '#0F172A' }]}
                >
                  <Text style={styles.startActionText}>Start Exercise ➔</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  countBadge: {
    fontSize: 11,
    fontWeight: '500',
  },
  list: {
    gap: 8,
  },
  itemCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subjectText: {
    fontSize: 11,
    fontWeight: '600',
  },
  priorityPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  progressBarTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressPercent: {
    fontSize: 10,
    fontWeight: '600',
    minWidth: 65,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  focusAction: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  focusActionText: {
    fontSize: 11,
    fontWeight: '700',
  },
  startAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  startActionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
