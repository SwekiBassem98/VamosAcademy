import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BAND_B_THEME } from '../../theme/tokens.ts';

interface XpProgressBarProps {
  currentXp: number;
  level: number;
  xpForNextLevel?: number;
}

export const XpProgressBar: React.FC<XpProgressBarProps> = ({
  currentXp,
  level,
  xpForNextLevel = 250,
}) => {
  const currentLevelProgress = currentXp % xpForNextLevel;
  const percent = Math.min(100, Math.round((currentLevelProgress / xpForNextLevel) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.levelPill}>
          <Text style={styles.levelText}>LVL {level}</Text>
        </View>
        <Text style={styles.xpText}>
          {currentLevelProgress} / {xpForNextLevel} XP
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  levelPill: {
    backgroundColor: BAND_B_THEME.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  xpText: {
    fontSize: 12,
    color: BAND_B_THEME.colors.textMuted,
    fontWeight: '600',
  },
  track: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: BAND_B_THEME.colors.accent,
  },
});
