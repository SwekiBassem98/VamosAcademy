import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { OriginalMascotView } from '../../components/band-a/OriginalMascotView.tsx';
import { MemoryMatchGame } from '../../components/games/MemoryMatchGame.tsx';
import { TimedQuizGame } from '../../components/games/TimedQuizGame.tsx';
import { useProgressStore } from '../../store/progressStore.ts';
import { useGameStore } from '../../store/gameStore.ts';
import { playTapSound, playStarSound } from '../../lib/soundEffects.ts';

type ActiveGameMode = 'hub' | 'memory' | 'quiz';

export default function BandAGames() {
  const router = useRouter();
  const [activeGame, setActiveGame] = useState<ActiveGameMode>('hub');
  const stars = useProgressStore((s) => s.metrics.stars);
  const games = useGameStore((s) => s.games.filter((g) => g.band === 'BAND_A'));

  const memoryGameItem = games.find((g) => g.id === 'ga_1') || games[0];
  const quizGameItem = games.find((g) => g.id === 'ga_2') || games[1];

  if (activeGame === 'memory') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <MemoryMatchGame
          band="BAND_A"
          pairCount={3}
          gameId={memoryGameItem.id}
          gameTitle="FENNEC STAR MEMORY"
          onExit={() => {
            playTapSound();
            setActiveGame('hub');
          }}
        />
      </SafeAreaView>
    );
  }

  if (activeGame === 'quiz') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <TimedQuizGame
          band="BAND_A"
          gameId={quizGameItem.id}
          gameTitle="DÉFI DES ÉTOILES (QUIZ)"
          questionCount={4}
          onExit={() => {
            playTapSound();
            setActiveGame('hub');
          }}
        />
      </SafeAreaView>
    );
  }

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
          testID="games_back_button"
        >
          <Text style={styles.backEmoji}>⬅️</Text>
        </TouchableOpacity>

        <View style={styles.screenTitleBadge}>
          <Text style={styles.screenTitleEmoji}>🎮</Text>
          <Text style={styles.screenTitleText}>JEUX DE LINA</Text>
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
        {/* Lina the Turtle Greeting */}
        <View style={styles.mascotArea}>
          <OriginalMascotView
            mascotId="lina"
            customDialogue="Bienvenue dans mon atelier de jeux ! Choisis ton défi 🎮"
            size="medium"
          />
        </View>

        <Text style={styles.title}>JEUX & DÉFIS MAGIQUES</Text>
        <Text style={styles.subtitle}>
          Entraîne ta mémoire et gagne des étoiles avec Lina et Farès !
        </Text>

        {/* Game Card 1: Star Memory Match */}
        <View style={styles.gameCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <Text style={styles.gameEmoji}>🐢</Text>
            </View>
            <View style={styles.cardHeaderInfo}>
              <Text style={styles.gameName}>Fennec Star Memory</Text>
              <Text style={styles.gameDesc}>
                Retrouve les paires d’animaux et habitats du Sahara.
              </Text>
              <View style={styles.badgeRow}>
                <View style={styles.tagPill}>
                  <Text style={styles.tagText}>⭐ 3 Paires • Sans stress</Text>
                </View>
                <Text style={styles.recordText}>
                  Record : {memoryGameItem?.highScore || 320} pts
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              playTapSound();
              setActiveGame('memory');
            }}
            style={styles.playButton}
            testID="play_memory_game_button"
          >
            <Text style={styles.playButtonText}>JOUER AU MEMORY ➔</Text>
          </TouchableOpacity>
        </View>

        {/* Game Card 2: Beat the Clock Timed Quiz */}
        <View style={[styles.gameCard, styles.quizCard]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, styles.quizIconCircle]}>
              <Text style={styles.gameEmoji}>⏱️</Text>
            </View>
            <View style={styles.cardHeaderInfo}>
              <Text style={styles.gameName}>Défi des Étoiles (Quiz)</Text>
              <Text style={styles.gameDesc}>
                Petits calculs et devinettes de nature avec nos compagnons.
              </Text>
              <View style={styles.badgeRow}>
                <View style={[styles.tagPill, styles.quizTagPill]}>
                  <Text style={[styles.tagText, styles.quizTagText]}>
                    ⏱️ 30s • Indices bienveillants
                  </Text>
                </View>
                <Text style={styles.recordText}>
                  Record : {quizGameItem?.highScore || 280} pts
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              playTapSound();
              setActiveGame('quiz');
            }}
            style={[styles.playButton, styles.quizPlayButton]}
            testID="play_quiz_game_button"
          >
            <Text style={styles.playButtonText}>COMMENCER LE DÉFI ➔</Text>
          </TouchableOpacity>
        </View>
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
    borderColor: '#EFF6FF',
    gap: 6,
  },
  screenTitleEmoji: {
    fontSize: 16,
  },
  screenTitleText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1A56C4', // Club Africain Cobalt Blue
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
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#12151B',
    marginTop: 6,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 16,
    textAlign: 'center',
  },
  gameCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 2,
    borderColor: '#EFF6FF',
    borderBottomWidth: 5,
    borderBottomColor: '#DBEAFE',
    marginBottom: 16,
    shadowColor: '#12151B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  quizCard: {
    borderColor: '#FDE2E6',
    borderBottomColor: '#F8B4BD',
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizIconCircle: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  gameEmoji: {
    fontSize: 28,
  },
  cardHeaderInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#12151B',
  },
  gameDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  tagPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  quizTagPill: {
    backgroundColor: '#FFF1F2',
  },
  tagText: {
    color: '#1A56C4',
    fontSize: 10,
    fontWeight: '800',
  },
  quizTagText: {
    color: '#D80027',
  },
  recordText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
  },
  playButton: {
    backgroundColor: '#1A56C4', // Club Africain Cobalt Blue
    height: 48,
    borderRadius: 16,
    borderBottomWidth: 4,
    borderBottomColor: '#1545A3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizPlayButton: {
    backgroundColor: '#D80027', // Club Africain Rouge highlight
    borderBottomColor: '#B70020',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
