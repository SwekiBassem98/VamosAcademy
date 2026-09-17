import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BAND_B_THEME } from '../../theme/tokens.ts';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  isCurrentUser?: boolean;
  streak: number;
  classSection?: string;
}

const CLASS_DATA: LeaderboardEntry[] = [
  { rank: 1, name: 'Yassine Khedira', avatar: '🦅', xp: 1420, streak: 8, classSection: '7-B' },
  { rank: 2, name: 'Amina Bouazizi', avatar: '⚡', xp: 1380, streak: 6, classSection: '7-B' },
  { rank: 3, name: 'Ryan Trabelsi', avatar: '🐺', xp: 1290, streak: 5, classSection: '7-B' },
  { rank: 4, name: 'You (Cadet Bassem)', avatar: '⚡', xp: 1240, streak: 5, isCurrentUser: true, classSection: '7-B' },
  { rank: 5, name: 'Nour Marzouki', avatar: '🦁', xp: 1180, streak: 4, classSection: '7-B' },
  { rank: 6, name: 'Firas Jlassi', avatar: '🦉', xp: 1090, streak: 3, classSection: '7-B' },
];

const AGE_BAND_DATA: LeaderboardEntry[] = [
  { rank: 1, name: 'Leila S. (Tunis)', avatar: '👑', xp: 1890, streak: 12 },
  { rank: 2, name: 'Mehdi A. (Sfax)', avatar: '🚀', xp: 1740, streak: 9 },
  { rank: 3, name: 'Yassine K. (Sousse)', avatar: '🦅', xp: 1420, streak: 8 },
  { rank: 4, name: 'Amina B. (Sousse)', avatar: '⚡', xp: 1380, streak: 6 },
  { rank: 7, name: 'You (Cadet Bassem)', avatar: '⚡', xp: 1240, streak: 5, isCurrentUser: true },
];

interface ClassLeaderboardProps {
  onViewAll?: () => void;
  compact?: boolean;
}

export function ClassLeaderboard({ onViewAll, compact = false }: ClassLeaderboardProps) {
  const [scope, setScope] = useState<'class' | 'age'>('class');

  const data = scope === 'class' ? CLASS_DATA : AGE_BAND_DATA;
  const displayItems = compact ? data.slice(0, 4) : data;

  return (
    <View style={styles.card}>
      {/* Scope Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionHeading}>LEADERBOARD</Text>
          <Text style={styles.subHeading}>
            {scope === 'class' ? 'Class 7-B • Sousse Middle School' : 'Ages 10–13 • Tunisia Central'}
          </Text>
        </View>

        {/* Scoped Toggle Pills */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.togglePill, scope === 'class' && styles.toggleActive]}
            onPress={() => setScope('class')}
          >
            <Text style={[styles.toggleText, scope === 'class' && styles.toggleTextActive]}>
              Class 7-B
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.togglePill, scope === 'age' && styles.toggleActive]}
            onPress={() => setScope('age')}
          >
            <Text style={[styles.toggleText, scope === 'age' && styles.toggleTextActive]}>
              Ages 10–13
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* League Promotion Notice */}
      <View style={styles.promotionBanner}>
        <Text style={styles.promotionIcon}>🏆</Text>
        <Text style={styles.promotionText}>
          <Text style={styles.promotionBold}>Gold League Division</Text> • Top 5 promote to Diamond in 2d
        </Text>
      </View>

      {/* Ranks List */}
      <View style={styles.listContainer}>
        {displayItems.map((item) => {
          const medal = item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : null;
          return (
            <View
              key={`${item.rank}-${item.name}`}
              style={[styles.itemRow, item.isCurrentUser && styles.currentUserRow]}
            >
              <View style={styles.rankBadge}>
                {medal ? (
                  <Text style={styles.medalEmoji}>{medal}</Text>
                ) : (
                  <Text style={[styles.rankNumber, item.isCurrentUser && styles.currentRankText]}>
                    #{item.rank}
                  </Text>
                )}
              </View>

              <Text style={styles.avatarEmoji}>{item.avatar}</Text>

              <View style={styles.nameCol}>
                <Text style={[styles.studentName, item.isCurrentUser && styles.currentStudentName]}>
                  {item.name}
                </Text>
                <Text style={styles.streakText}>🔥 {item.streak} day streak</Text>
              </View>

              <View style={styles.xpCol}>
                <Text style={[styles.xpValue, item.isCurrentUser && styles.currentXpValue]}>
                  {item.xp} XP
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {onViewAll && (
        <TouchableOpacity style={styles.viewFullButton} onPress={onViewAll}>
          <Text style={styles.viewFullText}>VIEW FULL STANDINGS ➔</Text>
        </TouchableOpacity>
      )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.8,
  },
  subHeading: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
  },
  togglePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  toggleActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  toggleTextActive: {
    color: BAND_B_THEME.colors.primary,
    fontWeight: '800',
  },
  promotionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 12,
    gap: 6,
  },
  promotionIcon: {
    fontSize: 14,
  },
  promotionText: {
    fontSize: 11,
    color: '#92400E',
    flex: 1,
  },
  promotionBold: {
    fontWeight: '800',
    color: '#B45309',
  },
  listContainer: {
    gap: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
  },
  currentUserRow: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1.5,
    borderColor: BAND_B_THEME.colors.primary,
  },
  rankBadge: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalEmoji: {
    fontSize: 16,
  },
  rankNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  currentRankText: {
    color: BAND_B_THEME.colors.primary,
  },
  avatarEmoji: {
    fontSize: 22,
    marginHorizontal: 8,
  },
  nameCol: {
    flex: 1,
  },
  studentName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  currentStudentName: {
    color: BAND_B_THEME.colors.primary,
    fontWeight: '800',
  },
  streakText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  xpCol: {
    alignItems: 'flex-end',
  },
  xpValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  currentXpValue: {
    color: BAND_B_THEME.colors.primary,
  },
  viewFullButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  viewFullText: {
    fontSize: 12,
    fontWeight: '800',
    color: BAND_B_THEME.colors.primary,
    letterSpacing: 0.5,
  },
});
