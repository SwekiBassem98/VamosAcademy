import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BAND_B_THEME } from '../../theme/tokens.ts';

interface MissionCardProps {
  title: string;
  category: string;
  xpReward: number;
  progressPercent: number;
  onStart: () => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  title,
  category,
  xpReward,
  progressPercent,
  onStart,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category.toUpperCase()}</Text>
        </View>
        <View style={styles.xpBadge}>
          <Text style={styles.xpText}>+{xpReward} XP</Text>
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.progressContainer}>
        <View style={styles.barBg}>
          <View style={[styles.barFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.progressLabel}>{progressPercent}% Done</Text>
      </View>

      <TouchableOpacity activeOpacity={0.8} onPress={onStart} style={styles.actionBtn}>
        <Text style={styles.actionBtnText}>Launch Mission →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1.5,
    borderColor: BAND_B_THEME.colors.outline,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: BAND_B_THEME.colors.primaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    color: BAND_B_THEME.colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  xpBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  xpText: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: BAND_B_THEME.colors.textPrimary,
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 14,
  },
  barBg: {
    height: 7,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  barFill: {
    height: '100%',
    backgroundColor: BAND_B_THEME.colors.secondary,
  },
  progressLabel: {
    fontSize: 11,
    color: BAND_B_THEME.colors.textMuted,
    fontWeight: '600',
    textAlign: 'right',
  },
  actionBtn: {
    backgroundColor: BAND_B_THEME.colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
