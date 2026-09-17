import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BAND_B_THEME } from '../../theme/tokens.ts';

interface StreakBadgeProps {
  days: number;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ days }) => {
  return (
    <View style={styles.badge}>
      <Text style={styles.flame}>🔥</Text>
      <Text style={styles.daysText}>{days}</Text>
      <Text style={styles.label}>DAY STREAK</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  flame: {
    fontSize: 16,
  },
  daysText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#B45309',
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.5,
  },
});
