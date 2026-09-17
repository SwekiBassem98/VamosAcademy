import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { BAND_B_THEME } from '../../theme/tokens.ts';
import { useProgressStore } from '../../store/progressStore.ts';
import { useGameStore } from '../../store/gameStore.ts';
import { TimedQuizGame } from '../../components/games/TimedQuizGame.tsx';
import { MemoryMatchGame } from '../../components/games/MemoryMatchGame.tsx';
import { ClassLeaderboardModal } from '../../components/games/ClassLeaderboardModal.tsx';

type GameMode = 'hub' | 'trivia' | 'memory';

export default function BandBGamesScreen() {
  const router = useRouter();
  const xp = useProgressStore((s) => s.metrics.xp);
  const streak = useProgressStore((s) => s.metrics.streakDays);
  const [activeGame, setActiveGame] = useState<GameMode>('hub');
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);

  const games = useGameStore((s) => s.games.filter((g) => g.band === 'BAND_B'));
  const triviaGameItem = games.find((g) => g.id === 'gb_1') || games[0];
  const memoryGameItem = games.find((g) => g.id === 'gb_2') || games[1];

  if (activeGame === 'trivia') {
    return (
      <TimedQuizGame
        band="BAND_B"
        gameId={triviaGameItem.id}
        gameTitle="VANGUARD SPEED TRIVIA"
        questionCount={5}
        onExit={() => setActiveGame('hub')}
      />
    );
  }

  if (activeGame === 'memory') {
    return (
      <MemoryMatchGame
        band="BAND_B"
        pairCount={4}
        gameId={memoryGameItem.id}
        gameTitle="TECH & SCIENCE MEMORY MATCH"
        onExit={() => setActiveGame('hub')}
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Banner */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.title}>VANGUARD ARENA</Text>
          <TouchableOpacity
            onPress={() => setLeaderboardVisible(true)}
            style={styles.leaderboardBtn}
          >
            <Text style={styles.leaderboardBtnText}>🏆 CLASSEMENT</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sub}>
          Épreuves de vitesse, logique & maîtrise des concepts clés Vamos
        </Text>
      </View>

      {/* Cadet XP & Streak Status */}
      <View style={styles.statusBar}>
        <View style={styles.statusCol}>
          <Text style={styles.statusLabel}>VANGUARD XP</Text>
          <Text style={styles.statusVal}>⚡ {xp} XP</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statusCol}>
          <Text style={styles.statusLabel}>SÉRIE EN COURS</Text>
          <Text style={styles.statusVal}>🔥 {streak} Jours</Text>
        </View>
      </View>

      {/* Game 1: Vanguard Speed Trivia */}
      <View style={styles.gameCard}>
        <View style={styles.gameTop}>
          <View style={styles.iconBox}>
            <Text style={styles.gameIcon}>⚡</Text>
          </View>
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>Vanguard Speed Trivia</Text>
            <Text style={styles.gameDesc}>
              Course de vitesse (15s/q) : fractions, lois physiques et algorithmes Python !
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.tierText}>Cadence : 15s • Combos de points</Text>
              <Text style={styles.highScoreText}>
                Record : {triviaGameItem?.highScore || 1450} pts
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.playBtn}
          onPress={() => setActiveGame('trivia')}
        >
          <Text style={styles.playBtnText}>LANCER LE SPRINT (+XP) ➔</Text>
        </TouchableOpacity>
      </View>

      {/* Game 2: Tech & Sciences Memory Match */}
      <View style={styles.gameCard}>
        <View style={styles.gameTop}>
          <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
            <Text style={styles.gameIcon}>🤖</Text>
          </View>
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>Memory Match : Sciences & Tech</Text>
            <Text style={styles.gameDesc}>
              Associe les concepts énergétiques, formules et structures de programmation.
            </Text>
            <View style={styles.metaRow}>
              <Text style={[styles.tierText, { color: '#0284C7' }]}>
                4 Paires • Mémoire tactique
              </Text>
              <Text style={styles.highScoreText}>
                Record : {memoryGameItem?.highScore || 980} pts
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.playBtn, { backgroundColor: '#0284C7' }]}
          onPress={() => setActiveGame('memory')}
        >
          <Text style={styles.playBtnText}>DÉFI MÉMOIRE (+XP) ➔</Text>
        </TouchableOpacity>
      </View>

      {/* Return button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>← RETOUR AU QUARTIER GÉNÉRAL</Text>
      </TouchableOpacity>

      {/* Arena Leaderboard Modal */}
      <ClassLeaderboardModal
        visible={leaderboardVisible}
        onClose={() => setLeaderboardVisible(false)}
        gameId="gb_1"
        band="BAND_B"
        studentScore={triviaGameItem?.highScore || 1450}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BAND_B_THEME.colors.surface,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 14,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  sub: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 3,
  },
  leaderboardBtn: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  leaderboardBtnText: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: '800',
  },
  statusBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    alignItems: 'center',
  },
  statusCol: {
    flex: 1,
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  statusVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: '#E2E8F0',
  },
  gameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  gameTop: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameIcon: {
    fontSize: 24,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  gameDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  tierText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#06B6D4',
  },
  highScoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  playBtn: {
    backgroundColor: BAND_B_THEME.colors.primary,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  backButton: {
    marginTop: 8,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: BAND_B_THEME.colors.primary,
  },
});
