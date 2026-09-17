import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BAND_B_THEME } from '../../theme/tokens.ts';

interface LevelAvatarProps {
  level: number;
  xp: number;
  rankTitle?: string;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export function LevelAvatar({
  level,
  xp,
  rankTitle = 'Vanguard Specialist',
  onPress,
  size = 'medium',
}: LevelAvatarProps) {
  // Level threshold calculation
  const nextLevelXp = level * 300;
  const currentLevelBaseXp = (level - 1) * 300;
  const progressInLevel = Math.max(0, xp - currentLevelBaseXp);
  const xpToNext = Math.max(0, nextLevelXp - xp);
  const percent = Math.min(100, Math.round((progressInLevel / 300) * 100));

  const avatarByLevel = level >= 6 ? '🦅' : level >= 4 ? '⚡' : level >= 2 ? '🐺' : '🌱';

  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarEmoji}>{avatarByLevel}</Text>
          <View style={styles.levelPill}>
            <Text style={styles.levelPillText}>LVL {level}</Text>
          </View>
        </View>

        <View style={styles.infoCol}>
          <View style={styles.rankRow}>
            <Text style={styles.rankTitle}>{rankTitle.toUpperCase()}</Text>
            <View style={styles.tierBadge}>
              <Text style={styles.tierBadgeText}>TIER {Math.ceil(level / 2)}</Text>
            </View>
          </View>
          <Text style={styles.xpText}>
            <Text style={styles.xpBold}>{xp} XP</Text> • {xpToNext} XP to Level {level + 1}
          </Text>

          {/* XP Progress Track */}
          <View style={styles.trackBackground}>
            <View style={[styles.trackFill, { width: `${percent}%` }]} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarContainer: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#EEF2FF',
    borderWidth: 2.5,
    borderColor: BAND_B_THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  levelPill: {
    position: 'absolute',
    bottom: -6,
    backgroundColor: BAND_B_THEME.colors.primary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  levelPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  infoCol: {
    flex: 1,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  rankTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  tierBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  tierBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },
  xpText: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 6,
  },
  xpBold: {
    color: BAND_B_THEME.colors.primary,
    fontWeight: '800',
  },
  trackBackground: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    backgroundColor: BAND_B_THEME.colors.primary,
    borderRadius: 6,
  },
});
