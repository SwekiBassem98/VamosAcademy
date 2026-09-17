import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BAND_A_THEME } from '../../theme/tokens.ts';
import { OriginalMascotView, MascotId, MASCOTS } from '../../components/band-a/OriginalMascotView.tsx';
import { LearningPathTrail, PathNode } from '../../components/band-a/LearningPathTrail.tsx';
import { MascotQuickHub } from '../../components/band-a/MascotQuickHub.tsx';
import { RewardShowcase } from '../../components/band-a/RewardShowcase.tsx';
import { StarRewardModal } from '../../components/band-a/StarRewardModal.tsx';
import { useProgressStore } from '../../store/progressStore.ts';
import { useUserStore } from '../../store/userStore.ts';
import { playTapSound, playStarSound, playBoingSound } from '../../lib/soundEffects.ts';

export default function BandAHomeScreen() {
  const router = useRouter();
  const student = useUserStore((s) => s.student);
  const { stars, streakDays } = useProgressStore((s) => s.metrics);
  const recentCelebration = useProgressStore((s) => s.recentCelebration);

  const [selectedMascot, setSelectedMascot] = useState<MascotId>('fares');
  const [mascotCheer, setMascotCheer] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const studentFirstName = student?.fullName?.split(' ')[0] || 'Champion';

  const handleMascotTap = () => {
    setMascotCheer(true);
    setTimeout(() => setMascotCheer(false), 1800);
  };

  const handleSelectNode = (node: PathNode) => {
    if (node.status === 'locked') {
      playBoingSound();
      return;
    }
    // Launch exercise/practice mission
    router.push('/(band-a)/practice' as any);
  };

  const handleMascotSelect = (id: MascotId) => {
    setSelectedMascot(id);
    playTapSound();
    if (id === 'lina') {
      // Lina guides to games
      router.push('/(band-a)/games' as any);
    } else if (id === 'nour') {
      // Nour guides to exercises
      router.push('/(band-a)/exercises' as any);
    } else if (id === 'zack') {
      // Zack guides to stickers & stars
      router.push('/(band-a)/stars' as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Soft, Low-Chrome Top Bar: Child Greeting + Star Bank */}
        <View style={styles.topBar}>
          <View style={styles.childGreetingCol}>
            <View style={styles.bandPill}>
              <Text style={styles.bandPillText}>LES EXPLORATEURS (6–9 ANS)</Text>
            </View>
            <Text style={styles.greetingTitle}>Bonjour, {studentFirstName} ! 👋</Text>
          </View>

          {/* Star & Streak Pills */}
          <View style={styles.countersRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                playStarSound();
                router.push('/(band-a)/stars' as any);
              }}
              style={styles.starPill}
              testID="home_star_pill"
            >
              <Text style={styles.starEmoji}>⭐</Text>
              <Text style={styles.starCount}>{stars}</Text>
            </TouchableOpacity>

            <View style={styles.streakPill}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakCount}>{streakDays}j</Text>
            </View>
          </View>
        </View>

        {/* Character-Led Hero Guide: Farès le Fennec Front and Center */}
        <View style={styles.mascotHeroArea}>
          <OriginalMascotView
            mascotId={selectedMascot}
            isCelebrating={mascotCheer || !!recentCelebration}
            customDialogue={
              recentCelebration?.message ||
              (selectedMascot === 'fares'
                ? `Prêt pour l'aventure, ${studentFirstName} ? Suis le chemin !`
                : MASCOTS[selectedMascot].dialogue)
            }
            onPress={handleMascotTap}
            size="hero"
          />
        </View>

        {/* Main Instant Action: Continue Journey CTA (Khan Academy Kids big button) */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            playTapSound();
            router.push('/(band-a)/practice' as any);
          }}
          style={styles.primaryJourneyCta}
          testID="continue_journey_cta"
        >
          <View style={styles.ctaIconRing}>
            <Text style={styles.ctaIcon}>🚀</Text>
          </View>
          <View style={styles.ctaTextCol}>
            <Text style={styles.ctaBadge}>MISSION EN COURS</Text>
            <Text style={styles.ctaTitle}>Palais de Carthage</Text>
            <Text style={styles.ctaSub}>Étape 3 • Gagne +3 étoiles ⭐</Text>
          </View>
          <View style={styles.goButtonCircle}>
            <Text style={styles.goButtonText}>➔</Text>
          </View>
        </TouchableOpacity>

        {/* Mascot Quick Companions Bar (Khan Academy Kids Room Switcher) */}
        <MascotQuickHub
          activeMascotId={selectedMascot}
          onSelectMascot={handleMascotSelect}
        />

        {/* Learning Path: Winding Trail Progression Metaphor */}
        <LearningPathTrail
          onSelectNode={handleSelectNode}
          onMascotCheer={handleMascotTap}
        />

        {/* Rewards Showcase: Stars & Sticker Album Accumulation */}
        <RewardShowcase />

        <StarRewardModal
          visible={modalVisible}
          starsEarned={3}
          onClose={() => setModalVisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFDF9', // Soft warm cream canvas
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  childGreetingCol: {
    flex: 1,
    paddingRight: 8,
  },
  bandPill: {
    backgroundColor: '#FDE2E6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  bandPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#D80027', // Club Africain Rouge highlight
    letterSpacing: 0.5,
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#12151B',
  },
  countersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    shadowColor: '#12151B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  starEmoji: {
    fontSize: 16,
  },
  starCount: {
    fontSize: 14,
    fontWeight: '900',
    color: '#B45309',
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    gap: 3,
  },
  streakEmoji: {
    fontSize: 14,
  },
  streakCount: {
    fontSize: 13,
    fontWeight: '900',
    color: '#E11D48',
  },
  mascotHeroArea: {
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryJourneyCta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FDE2E6',
    borderBottomWidth: 5,
    borderBottomColor: '#F8B4BD',
    shadowColor: '#D80027',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    gap: 12,
    marginTop: 6,
    marginBottom: 8,
  },
  ctaIconRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FDE2E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaIcon: {
    fontSize: 26,
  },
  ctaTextCol: {
    flex: 1,
  },
  ctaBadge: {
    fontSize: 9,
    fontWeight: '900',
    color: '#D80027', // Club Africain accent
    letterSpacing: 0.6,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#12151B',
    marginTop: 1,
  },
  ctaSub: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  goButtonCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#D80027',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D80027',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  goButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});
