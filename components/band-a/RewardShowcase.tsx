import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BAND_A_THEME } from '../../theme/tokens.ts';
import { useProgressStore, STICKER_CATALOG } from '../../store/progressStore.ts';

export const RewardShowcase: React.FC = () => {
  const router = useRouter();
  const { stars, streakDays } = useProgressStore((s) => s.metrics);

  // Find next sticker to unlock
  const nextSticker = STICKER_CATALOG.find((s) => s.starsRequired > stars) || STICKER_CATALOG[STICKER_CATALOG.length - 1];
  const starsNeeded = Math.max(0, nextSticker.starsRequired - stars);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push('/(band-a)/stars' as any)}
      style={styles.card}
    >
      {/* Top Row: Big Star Bank & Streak */}
      <View style={styles.topRow}>
        <View style={styles.starPill}>
          <Text style={styles.starBigEmoji}>⭐</Text>
          <View>
            <Text style={styles.starNumber}>{stars}</Text>
            <Text style={styles.starLabel}>STARS</Text>
          </View>
        </View>

        <View style={styles.streakPill}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <View>
            <Text style={styles.streakNumber}>{streakDays}</Text>
            <Text style={styles.streakLabel}>DAYS</Text>
          </View>
        </View>
      </View>

      {/* Unlocked Sticker Badges Showcase */}
      <View style={styles.stickersSection}>
        <View style={styles.stickersHeaderRow}>
          <Text style={styles.stickersTitle}>MY STICKER ALBUM</Text>
          <Text style={styles.viewAllText}>Tap to open ➔</Text>
        </View>

        <View style={styles.stickerBadgesRow}>
          {STICKER_CATALOG.map((stk) => {
            const isUnlocked = stars >= stk.starsRequired;
            return (
              <View
                key={stk.id}
                style={[
                  styles.stickerBadge,
                  {
                    backgroundColor: isUnlocked ? '#FEF3C7' : '#F1F5F9',
                    borderColor: isUnlocked ? '#F59E0B' : '#CBD5E1',
                  },
                ]}
              >
                <Text style={styles.stickerEmoji}>
                  {isUnlocked ? stk.emoji : '🔒'}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Progress to next sticker */}
      {starsNeeded > 0 ? (
        <View style={styles.nextRewardBar}>
          <Text style={styles.nextRewardText}>
            🎯 {starsNeeded} more ⭐ to unlock {nextSticker.emoji} {nextSticker.name}!
          </Text>
        </View>
      ) : (
        <View style={[styles.nextRewardBar, { backgroundColor: '#D1FAE5' }]}>
          <Text style={[styles.nextRewardText, { color: '#065F46' }]}>
            👑 Master Explorer! All current stickers unlocked!
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 16,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: '#F2D8D0',
    borderBottomWidth: 5,
    borderBottomColor: '#E6C6BD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  starPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FDE68A',
    gap: 10,
  },
  starBigEmoji: {
    fontSize: 32,
  },
  starNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#B45309',
    lineHeight: 24,
  },
  starLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.8,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FECACA',
    gap: 10,
  },
  streakEmoji: {
    fontSize: 26,
  },
  streakNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#DC2626',
    lineHeight: 22,
  },
  streakLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#EF4444',
    letterSpacing: 0.8,
  },
  stickersSection: {
    marginTop: 12,
  },
  stickersHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stickersTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C6E75',
    letterSpacing: 0.6,
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: BAND_A_THEME.colors.primary,
  },
  stickerBadgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  stickerBadge: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickerEmoji: {
    fontSize: 20,
  },
  nextRewardBar: {
    marginTop: 10,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextRewardText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C2410C',
  },
});
