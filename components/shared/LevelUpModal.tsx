import React from 'react';
import { View, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText.tsx';
import { ThemedButton } from './ThemedButton.tsx';
import { useUserStore } from '../../store/userStore.ts';
import { useTheme } from '../../theme/ThemeProvider.tsx';
import { useRouter } from 'expo-router';
import type { AgeBand } from '../../theme/types.ts';

interface LevelUpModalProps {
  visible: boolean;
  onDismiss?: () => void;
}

const BAND_DETAILS: Record<AgeBand, {
  name: string;
  tagline: string;
  color: string;
  icon: string;
  companion: string;
  features: string[];
}> = {
  BAND_A: {
    name: 'The Explorers (Band A)',
    tagline: 'Joyful, playful, tactile early learning',
    color: '#FF6B4A',
    icon: '🦊',
    companion: 'Fenno the Fennec Fox',
    features: ['Sticker Star Book', 'Big Touch Buttons', 'Voice Read-Aloud Drills'],
  },
  BAND_B: {
    name: 'The Adventurers (Band B)',
    tagline: 'Gamified quests, XP ranks, and Carthage guilds',
    color: '#4F46E5',
    icon: '⚡',
    companion: 'Carbo the Cyber Falcon',
    features: ['Daily Streaks & XP Leaderboard', 'Carthage Guild Quests', 'Interactive Math & Code Arenas'],
  },
  BAND_C: {
    name: 'The Scholars (Band C)',
    tagline: 'Minimalist, data-driven mastery for high school & baccalaureate',
    color: '#0F172A',
    icon: '🎓',
    companion: 'Sophia the Minerva Owl',
    features: ['Deep Work Pomodoro Drills', 'Baccalaureate Exam Archives', 'Curricular Mastery Analytics'],
  },
};

export function LevelUpModal({ visible, onDismiss }: LevelUpModalProps) {
  const router = useRouter();
  const { theme, setStudentAge } = useTheme();
  const levelUpInfo = useUserStore((s) => s.levelUpInfo);
  const acknowledgeLevelUp = useUserStore((s) => s.acknowledgeLevelUp);

  if (!visible || !levelUpInfo) {
    return null;
  }

  const prevBand = BAND_DETAILS[levelUpInfo.previousBand] || BAND_DETAILS.BAND_A;
  const newBand = BAND_DETAILS[levelUpInfo.newBand] || BAND_DETAILS.BAND_B;

  const handleEnterUpgradedApp = () => {
    setStudentAge(levelUpInfo.newAge);
    acknowledgeLevelUp();
    if (onDismiss) onDismiss();

    // Direct routing to the new band home screen immediately
    const routeMap: Record<AgeBand, string> = {
      BAND_A: '/(band-a)',
      BAND_B: '/(band-b)',
      BAND_C: '/(band-c)',
    };
    router.replace(routeMap[levelUpInfo.newBand] as any);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={[styles.container, { backgroundColor: '#0B0F19' }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Confetti & Celebration Header */}
          <View style={styles.celebrationBadge}>
            <ThemedText variant="caption" style={{ color: '#F59E0B', fontWeight: '800', letterSpacing: 1.5 }}>
              🎂 BIRTHDAY MILESTONE REACHED
            </ThemedText>
          </View>

          <ThemedText variant="display" style={styles.title}>
            Your App Just Leveled Up!
          </ThemedText>

          <ThemedText variant="bodyRegular" style={styles.subtitle}>
            You celebrated a birthday! As you grow at Vamos Academy, your entire learning environment adapts to match your evolving intellect and ambitions.
          </ThemedText>

          {/* Before & After Transition Cards */}
          <View style={styles.transitionContainer}>
            <View style={[styles.bandBox, { borderColor: '#334155' }]}>
              <ThemedText variant="caption" style={{ color: '#94A3B8' }}>PREVIOUS TIER</ThemedText>
              <ThemedText variant="heading2" style={{ marginTop: 4 }}>{prevBand.icon}</ThemedText>
              <ThemedText variant="bodyBold" style={{ color: '#94A3B8', marginTop: 4, textAlign: 'center' }}>
                {prevBand.name}
              </ThemedText>
            </View>

            <View style={styles.arrowContainer}>
              <ThemedText variant="display" style={{ color: '#F59E0B' }}>➔</ThemedText>
            </View>

            <View style={[styles.bandBox, { borderColor: newBand.color, backgroundColor: '#1E293B' }]}>
              <ThemedText variant="caption" style={{ color: newBand.color, fontWeight: '700' }}>NEW UNLOCKED TIER</ThemedText>
              <ThemedText variant="heading2" style={{ marginTop: 4 }}>{newBand.icon}</ThemedText>
              <ThemedText variant="bodyBold" style={{ color: '#FFFFFF', marginTop: 4, textAlign: 'center' }}>
                {newBand.name}
              </ThemedText>
            </View>
          </View>

          {/* New Companion & Environment Details */}
          <View style={[styles.detailsCard, { borderColor: newBand.color }]}>
            <ThemedText variant="heading3" style={{ color: '#FFFFFF', marginBottom: 4 }}>
              What&apos;s New in Your Tier:
            </ThemedText>
            <ThemedText variant="bodyRegular" style={{ color: '#CBD5E1', marginBottom: 12 }}>
              Your companion is now <ThemedText variant="bodyBold" style={{ color: '#FCD34D' }}>{newBand.companion}</ThemedText>!
            </ThemedText>

            {newBand.features.map((feat, idx) => (
              <View key={idx} style={styles.featureRow}>
                <ThemedText variant="bodyBold" style={{ color: '#10B981', marginRight: 8 }}>✓</ThemedText>
                <ThemedText variant="bodyRegular" style={{ color: '#E2E8F0', flex: 1 }}>{feat}</ThemedText>
              </View>
            ))}
          </View>

          {/* Action button */}
          <TouchableOpacity
            style={[styles.primaryActionBtn, { backgroundColor: newBand.color }]}
            onPress={handleEnterUpgradedApp}
          >
            <ThemedText variant="bodyBold" style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 16 }}>
              Enter My Upgraded Academy 🚀
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  celebrationBadge: {
    backgroundColor: '#312E81',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  transitionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 24,
  },
  bandBox: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  arrowContainer: {
    paddingHorizontal: 12,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: '#111827',
    padding: 20,
    borderRadius: 18,
    borderWidth: 1.5,
    marginBottom: 28,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  primaryActionBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
});
