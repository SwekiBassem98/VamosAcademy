import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProgressStore, STICKER_CATALOG, StickerItem } from '../../store/progressStore.ts';
import { OriginalMascotView } from '../../components/band-a/OriginalMascotView.tsx';
import { playTapSound, playStarSound } from '../../lib/soundEffects.ts';

export default function StarsRewardScreen() {
  const router = useRouter();
  const { stars, streakDays } = useProgressStore((s) => s.metrics);
  const [selectedSticker, setSelectedSticker] = useState<StickerItem | null>(null);
  const [isDancing, setIsDancing] = useState(false);

  const handleTapSticker = (stk: StickerItem) => {
    const isUnlocked = stars >= stk.starsRequired;
    setSelectedSticker(stk);
    if (isUnlocked) {
      playStarSound();
      setIsDancing(true);
      setTimeout(() => setIsDancing(false), 2000);
    } else {
      playTapSound();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Low-Chrome Top Activity Bar */}
      <View style={styles.topChromeBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            playTapSound();
            router.back();
          }}
          style={styles.largeBackButton}
          testID="stars_back_button"
        >
          <Text style={styles.backEmoji}>⬅️</Text>
        </TouchableOpacity>

        <View style={styles.screenTitleBadge}>
          <Text style={styles.screenTitleEmoji}>⭐</Text>
          <Text style={styles.screenTitleText}>ALBUM D'ÉTOILES</Text>
        </View>

        <View style={styles.starPill}>
          <Text style={styles.starEmoji}>⭐</Text>
          <Text style={styles.starCount}>{stars}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Animated Mascot Reacting */}
        <View style={styles.mascotArea}>
          <OriginalMascotView
            mascotId="zack"
            isCelebrating={isDancing}
            customDialogue={
              selectedSticker
                ? `Tu as découvert : ${selectedSticker.name} ! ✨`
                : 'Regarde toutes les étoiles que tu as accumulées ! 🌟'
            }
            size="medium"
          />
        </View>

        {/* Prominent Star Bank Box */}
        <View style={styles.starBankBox}>
          <View style={styles.starHeroCircle}>
            <Text style={styles.starHeroEmoji}>⭐</Text>
          </View>
          <Text style={styles.starBigCount}>{stars}</Text>
          <Text style={styles.starBankLabel}>ÉTOILES MAGIQUES GAGNÉES</Text>
          <View style={styles.streakChip}>
            <Text style={styles.streakChipText}>
              🔥 Série de {streakDays} jours consécutifs !
            </Text>
          </View>
        </View>

        {/* Magic Sticker Album Grid */}
        <View style={styles.albumHeader}>
          <Text style={styles.albumTitle}>ALBUM DES AUTOCOLLANTS</Text>
          <Text style={styles.albumSub}>Touche un autocollant pour l'observer !</Text>
        </View>

        <View style={styles.stickerGrid}>
          {STICKER_CATALOG.map((stk) => {
            const isUnlocked = stars >= stk.starsRequired;
            const isSelected = selectedSticker?.id === stk.id;

            return (
              <TouchableOpacity
                key={stk.id}
                activeOpacity={0.85}
                onPress={() => handleTapSticker(stk)}
                style={[
                  styles.stickerCard,
                  {
                    backgroundColor: isUnlocked ? '#FFFBEB' : '#F8FAFC',
                    borderColor: isSelected
                      ? '#D80027' // Club Africain Rouge highlight
                      : isUnlocked
                      ? '#FDE68A'
                      : '#E2E8F0',
                    borderBottomColor: isSelected
                      ? '#B70020'
                      : isUnlocked
                      ? '#F59E0B'
                      : '#CBD5E1',
                  },
                ]}
                testID={`sticker_item_${stk.id}`}
              >
                <Text style={styles.stickerCardEmoji}>
                  {isUnlocked ? stk.emoji : '🔒'}
                </Text>
                <Text style={styles.stickerName}>
                  {isUnlocked ? stk.name : `${stk.starsRequired} ⭐`}
                </Text>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: isUnlocked ? '#16A34A' : '#94A3B8' },
                  ]}
                >
                  <Text style={styles.statusPillText}>
                    {isUnlocked ? 'DÉBLOQUÉ' : `${stk.starsRequired} ⭐`}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 1-Tap Action to Practice & earn more stars */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => {
            playTapSound();
            router.push('/(band-a)/practice' as any);
          }}
          style={styles.earnMoreButton}
          testID="earn_more_stars_button"
        >
          <Text style={styles.earnMoreText}>🚀 GAGNER PLUS D'ÉTOILES</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  topChromeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFDF9',
  },
  largeBackButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FDE2E6',
    borderBottomWidth: 4,
    borderBottomColor: '#F8B4BD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backEmoji: {
    fontSize: 20,
  },
  screenTitleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FEF3C7',
    gap: 6,
  },
  screenTitleEmoji: {
    fontSize: 16,
  },
  screenTitleText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: 0.6,
  },
  starPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    gap: 4,
  },
  starEmoji: {
    fontSize: 16,
  },
  starCount: {
    fontSize: 14,
    fontWeight: '900',
    color: '#B45309',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  mascotArea: {
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starBankBox: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FDE68A',
    borderBottomWidth: 5,
    borderBottomColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  starHeroCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFBEB',
    borderWidth: 2,
    borderColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  starHeroEmoji: {
    fontSize: 34,
  },
  starBigCount: {
    fontSize: 38,
    fontWeight: '900',
    color: '#B45309',
  },
  starBankLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  streakChip: {
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FECDD3',
    marginTop: 10,
  },
  streakChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#E11D48',
  },
  albumHeader: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  albumTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#12151B',
    letterSpacing: 0.6,
  },
  albumSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  stickerGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  stickerCard: {
    width: '48%',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  stickerCardEmoji: {
    fontSize: 34,
    marginBottom: 6,
  },
  stickerName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#12151B',
    textAlign: 'center',
    marginBottom: 6,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  earnMoreButton: {
    backgroundColor: '#D80027', // Club Africain accent
    width: '100%',
    maxWidth: 380,
    paddingVertical: 14,
    borderRadius: 22,
    borderBottomWidth: 4,
    borderBottomColor: '#B70020',
    alignItems: 'center',
    marginTop: 24,
  },
  earnMoreText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
});
