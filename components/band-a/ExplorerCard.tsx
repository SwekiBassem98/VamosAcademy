import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BAND_A_THEME } from '../../theme/tokens.ts';

interface ExplorerCardProps {
  title: string;
  emoji: string;
  starsCount: number;
  duration: string;
  onPress: () => void;
}

export const ExplorerCard: React.FC<ExplorerCardProps> = ({
  title,
  emoji,
  starsCount,
  duration,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.emojiContainer}>
        <Text style={styles.emojiText}>{emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.stars}>{'⭐'.repeat(starsCount)}</Text>
          <Text style={styles.duration}>⏱️ {duration}</Text>
        </View>
      </View>
      <View style={styles.playBadge}>
        <Text style={styles.playText}>GO!</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 2,
    borderColor: BAND_A_THEME.colors.outline,
    borderBottomWidth: 4,
    borderBottomColor: '#E6C6BD',
    marginVertical: 6,
  },
  emojiContainer: {
    width: 54,
    height: 54,
    borderRadius: 20,
    backgroundColor: BAND_A_THEME.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: {
    fontSize: 28,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: BAND_A_THEME.colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  stars: {
    fontSize: 13,
  },
  duration: {
    fontSize: 13,
    color: BAND_A_THEME.colors.textMuted,
    fontWeight: '600',
  },
  playBadge: {
    backgroundColor: BAND_A_THEME.colors.secondary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  playText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
});
