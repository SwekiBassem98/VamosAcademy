import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LearningPathTrail, PathNode } from '../../components/band-a/LearningPathTrail.tsx';
import { OriginalMascotView } from '../../components/band-a/OriginalMascotView.tsx';
import { useProgressStore } from '../../store/progressStore.ts';
import { playTapSound, playBoingSound } from '../../lib/soundEffects.ts';

export default function ProgressScreen() {
  const router = useRouter();
  const { stars } = useProgressStore((s) => s.metrics);

  const handleSelectNode = (node: PathNode) => {
    if (node.status === 'locked') {
      playBoingSound();
      return;
    }
    router.push('/(band-a)/practice' as any);
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
          testID="progress_back_button"
        >
          <Text style={styles.backEmoji}>⬅️</Text>
        </TouchableOpacity>

        <View style={styles.screenTitleBadge}>
          <Text style={styles.screenTitleEmoji}>🗺️</Text>
          <Text style={styles.screenTitleText}>CARTE DU VOYAGE</Text>
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
        {/* Mascot Greeting */}
        <View style={styles.mascotArea}>
          <OriginalMascotView
            mascotId="fares"
            customDialogue="Chaque étape réussie te rapproche du trésor cosmique ! 🚀"
            size="medium"
          />
        </View>

        {/* Winding Learning Path Trail */}
        <LearningPathTrail onSelectNode={handleSelectNode} />

        {/* Big Action Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => {
            playTapSound();
            router.push('/(band-a)/practice' as any);
          }}
          style={styles.continueButton}
          testID="continue_adventure_button"
        >
          <Text style={styles.continueText}>🚀 CONTINUER L'AVENTURE</Text>
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
    borderColor: '#FDE2E6',
    gap: 6,
  },
  screenTitleEmoji: {
    fontSize: 16,
  },
  screenTitleText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#D80027', // Club Africain Rouge Accent
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
    alignItems: 'center',
    paddingBottom: 40,
  },
  mascotArea: {
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButton: {
    backgroundColor: '#D80027', // Club Africain accent
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
    borderBottomWidth: 4,
    borderBottomColor: '#B70020',
    marginTop: 20,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
