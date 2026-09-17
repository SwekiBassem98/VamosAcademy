import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useProgressStore } from '../../store/progressStore.ts';
import { useGameStore } from '../../store/gameStore.ts';
import { TimedQuizGame } from '../../components/games/TimedQuizGame.tsx';
import { MemoryMatchGame } from '../../components/games/MemoryMatchGame.tsx';
import { ClassLeaderboardModal } from '../../components/games/ClassLeaderboardModal.tsx';

type GameMode = 'hub' | 'blitz' | 'memory';

export default function BandCGamesScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const xp = useProgressStore((s) => s.metrics.xp);
  const accuracyRate = useProgressStore((s) => s.metrics.accuracyRate);

  const [activeGame, setActiveGame] = useState<GameMode>('hub');
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);

  const games = useGameStore((s) => s.games.filter((g) => g.band === 'BAND_C'));
  const blitzItem = games.find((g) => g.id === 'gc_1') || games[0];
  const memoryItem = games.find((g) => g.id === 'gc_2') || games[1];

  const bg = isDark ? '#090D16' : '#F8FAFC';
  const cardBg = isDark ? '#111827' : '#FFFFFF';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const borderCol = isDark ? '#1F2937' : '#E2E8F0';
  const accent = isDark ? '#38BDF8' : '#0284C7';

  if (activeGame === 'blitz') {
    return (
      <TimedQuizGame
        band="BAND_C"
        gameId={blitzItem.id}
        gameTitle="BACCALAURÉAT BLITZ : SPRINT ÉCLAIR"
        questionCount={5}
        isDark={isDark}
        onExit={() => setActiveGame('hub')}
      />
    );
  }

  if (activeGame === 'memory') {
    return (
      <MemoryMatchGame
        band="BAND_C"
        pairCount={5}
        gameId={memoryItem.id}
        gameTitle="DOCTRINES & FORMULES : APPARIEMENT"
        isDark={isDark}
        onExit={() => setActiveGame('hub')}
      />
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={styles.content}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: textPrimary }]}>ÉPREUVES RAPIDES & DUELS</Text>
          <Text style={[styles.subtitle, { color: textMuted }]}>
            Entraînement réflexe haute cadence pour le Baccalauréat
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setLeaderboardVisible(true)}
          style={[styles.leaderboardBtn, { borderColor: borderCol, backgroundColor: cardBg }]}
        >
          <Text style={[styles.leaderboardBtnText, { color: accent }]}>🏆 Classement</Text>
        </TouchableOpacity>
      </View>

      {/* Telemetry Bar */}
      <View style={[styles.telemetryBar, { backgroundColor: cardBg, borderColor: borderCol }]}>
        <View style={styles.telemetryCol}>
          <Text style={[styles.telemetryLabel, { color: textMuted }]}>POINTS D'ÉTUDE</Text>
          <Text style={[styles.telemetryValue, { color: textPrimary }]}>{xp} PTS</Text>
        </View>
        <View style={[styles.telemetryDivider, { backgroundColor: borderCol }]} />
        <View style={styles.telemetryCol}>
          <Text style={[styles.telemetryLabel, { color: textMuted }]}>PRÉCISION MOYENNE</Text>
          <Text style={[styles.telemetryValue, { color: accent }]}>{accuracyRate || 94.2}%</Text>
        </View>
        <View style={[styles.telemetryDivider, { backgroundColor: borderCol }]} />
        <View style={styles.telemetryCol}>
          <Text style={[styles.telemetryLabel, { color: textMuted }]}>RANG CONCOURS</Text>
          <Text style={[styles.telemetryValue, { color: '#EAB308' }]}>#3 National</Text>
        </View>
      </View>

      {/* Game 1: Baccalaureate Blitz */}
      <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderCol }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.field, { color: accent }]}>CADENCE RAPIDE • 8S / QUESTION</Text>
          <Text style={[styles.highScoreTag, { color: textMuted }]}>
            Record : {blitzItem?.highScore || 2840} pts
          </Text>
        </View>
        <Text style={[styles.cardTitle, { color: textPrimary }]}>
          Baccalauréat Blitz : Sprint Éclair
        </Text>
        <Text style={[styles.desc, { color: textMuted }]}>
          Épreuve chrono impitoyable réutilisant les annales et exercices types du moteur :
          analyse réelle, nombres complexes, circuits RLC et thèses philosophiques.
        </Text>

        <View style={styles.btnRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveGame('blitz')}
            style={[styles.startBtn, { backgroundColor: isDark ? '#0284C7' : '#0F172A' }]}
          >
            <Text style={styles.startBtnText}>Lancer le Sprint Éclair ➔</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setLeaderboardVisible(true)}
            style={[styles.rankBtn, { borderColor: borderCol }]}
          >
            <Text style={[styles.rankBtnText, { color: textPrimary }]}>Palmarès</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Game 2: Doctrines & Formulas Memory Match */}
      <View style={[styles.card, { backgroundColor: cardBg, borderColor: borderCol }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.field, { color: '#10B981' }]}>
            APPARIEMENT CONCEPTUEL • 10 CARTES
          </Text>
          <Text style={[styles.highScoreTag, { color: textMuted }]}>
            Record : {memoryItem?.highScore || 1650} pts
          </Text>
        </View>
        <Text style={[styles.cardTitle, { color: textPrimary }]}>
          Memory Match : Doctrines & Dérivées
        </Text>
        <Text style={[styles.desc, { color: textMuted }]}>
          Association rapide des thèses philosophiques à leurs auteurs (Descartes, Kant, Nietzsche)
          et des fonctions d'analyse à leurs formes dérivées.
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveGame('memory')}
          style={[styles.startBtn, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9', borderWidth: 1, borderColor: borderCol }]}
        >
          <Text style={[styles.startBtnText, { color: textPrimary }]}>
            Démarrer le Memory Conceptuel ➔
          </Text>
        </TouchableOpacity>
      </View>

      {/* Return Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.backBtn, { borderColor: borderCol }]}
      >
        <Text style={[styles.backBtnText, { color: textPrimary }]}>
          ← Retour au tableau de bord
        </Text>
      </TouchableOpacity>

      {/* Leaderboard Modal */}
      <ClassLeaderboardModal
        visible={leaderboardVisible}
        onClose={() => setLeaderboardVisible(false)}
        gameId="gc_1"
        band="BAND_C"
        studentScore={blitzItem?.highScore || 2840}
        isDark={isDark}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  leaderboardBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  leaderboardBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  telemetryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  telemetryCol: {
    flex: 1,
    alignItems: 'center',
  },
  telemetryLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  telemetryValue: {
    fontSize: 14,
    fontWeight: '900',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  telemetryDivider: {
    width: 1,
    height: 24,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  field: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  highScoreTag: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  desc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  startBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  rankBtn: {
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  backBtn: {
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  backBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
