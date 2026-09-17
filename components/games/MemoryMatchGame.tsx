import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import type { AgeBand } from '../../theme/types.ts';
import type { MemoryCard, GameResultSummary } from '../../lib/exercises/gameTypes.ts';
import { getMemoryCardsForBand } from '../../lib/exercises/gameContent.ts';
import { recordGameSession } from '../../lib/exercises/api.ts';
import { useProgressStore } from '../../store/progressStore.ts';
import { useGameStore } from '../../store/gameStore.ts';
import { AnimatedMascot } from '../band-a/AnimatedMascot.tsx';

interface Props {
  band: AgeBand;
  pairCount?: number;
  studentId?: string;
  gameId: string;
  gameTitle?: string;
  onFinish?: (result: GameResultSummary) => void;
  onExit: () => void;
  isDark?: boolean;
}

export function MemoryMatchGame({
  band,
  pairCount,
  studentId = 'student_current',
  gameId,
  gameTitle,
  onFinish,
  onExit,
  isDark = false,
}: Props) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [movesCount, setMovesCount] = useState(0);
  const [matchesFound, setMatchesFound] = useState(0);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [gameResult, setGameResult] = useState<GameResultSummary | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<any>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const addStars = useProgressStore((s) => s.addStars);
  const addXp = useProgressStore((s) => s.addXp);
  const markExerciseComplete = useProgressStore((s) => s.markExerciseComplete);
  const updateHighScore = useGameStore((s) => s.updateHighScore);

  // Initialize game cards from curriculum matching pairs
  const initializeGame = () => {
    const loadedCards = getMemoryCardsForBand(band, pairCount);
    setCards(loadedCards);
    setFlippedCardIds([]);
    setIsEvaluating(false);
    setMovesCount(0);
    setMatchesFound(0);
    setIsCelebrating(false);
    setGameResult(null);
    setElapsedSeconds(0);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    initializeGame();
    timerIntervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [band, gameId]);

  const totalPairs = cards.length / 2;

  // Card Flip Logic
  const handleCardPress = (cardId: string) => {
    if (isEvaluating || flippedCardIds.includes(cardId)) return;

    const clickedCard = cards.find((c) => c.id === cardId);
    if (!clickedCard || clickedCard.isMatched) return;

    const newFlipped = [...flippedCardIds, cardId];
    setFlippedCardIds(newFlipped);

    // If second card flipped, evaluate pair
    if (newFlipped.length === 2) {
      setIsEvaluating(true);
      setMovesCount((m) => m + 1);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.id === firstId)!;
      const secondCard = cards.find((c) => c.id === secondId)!;

      const isMatch = firstCard.pairId === secondCard.pairId;

      if (isMatch) {
        // MATCH!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCardIds([]);
          setIsEvaluating(false);
          const newMatchCount = matchesFound + 1;
          setMatchesFound(newMatchCount);

          if (band === 'BAND_A') {
            setIsCelebrating(true);
            setTimeout(() => setIsCelebrating(false), 1200);
          }

          // Check if all pairs are found
          if (newMatchCount === totalPairs) {
            handleVictory(newMatchCount);
          }
        }, 500);
      } else {
        // MISMATCH — Forgiving timing: Band A gets 1.4s to view, Band B/C gets 800ms
        const mismatchTimeout = band === 'BAND_A' ? 1400 : 800;
        setTimeout(() => {
          setFlippedCardIds([]);
          setIsEvaluating(false);
        }, mismatchTimeout);
      }
    }
  };

  // Completion & Progress Sync
  const handleVictory = async (finalPairs: number) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    const duration = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

    // Calculate score
    const baseScore = finalPairs * 200;
    const speedBonus = Math.max(0, 300 - duration * 5);
    const efficiencyBonus = Math.max(0, 200 - movesCount * 10);
    const finalScore = baseScore + speedBonus + efficiencyBonus;

    // Record session in unified exercises backend
    const result = await recordGameSession({
      studentId,
      gameId,
      gameType: 'memory_match',
      bandTarget: band,
      score: finalScore,
      durationSeconds: duration,
      totalQuestions: finalPairs,
      correctAnswers: finalPairs,
      questionAttempts: cards
        .filter((c) => c.side === 'left')
        .map((c) => ({
          exerciseId: c.pairId,
          isCorrect: true,
          studentAnswer: c.label,
          timeTakenSeconds: Math.round(duration / finalPairs),
        })),
    });

    // Update stores
    updateHighScore(gameId, finalScore);
    if (band === 'BAND_A') {
      addStars(result.starsEarned);
    } else {
      addXp(result.xpEarned);
    }
    markExerciseComplete(gameId, 100);

    setGameResult(result);
    if (onFinish) onFinish(result);
  };

  // Styling based on band & dark mode
  const bg =
    band === 'BAND_A'
      ? '#F4FBF4'
      : band === 'BAND_B'
      ? isDark
        ? '#0F172A'
        : '#F8FAFC'
      : isDark
      ? '#090D16'
      : '#F8FAFC';

  const cardBackBg =
    band === 'BAND_A'
      ? '#38B000'
      : band === 'BAND_B'
      ? '#2563EB'
      : isDark
      ? '#1E293B'
      : '#0F172A';

  const cardFaceBg = isDark ? '#1E293B' : '#FFFFFF';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const accent =
    band === 'BAND_A' ? '#38B000' : band === 'BAND_B' ? '#06B6D4' : isDark ? '#38BDF8' : '#0284C7';

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={styles.content}>
      {/* Header bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onExit} style={styles.exitBtn}>
          <Text style={[styles.exitBtnText, { color: textPrimary }]}>✕ QUITTER</Text>
        </TouchableOpacity>
        <Text style={[styles.gameTitleText, { color: textPrimary }]}>
          {gameTitle || (band === 'BAND_A' ? 'STAR MEMORY' : 'MEMORY MATCH')}
        </Text>
        <TouchableOpacity onPress={initializeGame} style={styles.restartBtn}>
          <Text style={[styles.restartBtnText, { color: accent }]}>↺ REJOUER</Text>
        </TouchableOpacity>
      </View>

      {/* Band A Mascot Header */}
      {band === 'BAND_A' && (
        <View style={styles.mascotWrapper}>
          <AnimatedMascot
            isCelebrating={isCelebrating}
            celebrationMessage="BRAVO ! PAIRE TROUVÉE ! ⭐"
            size="medium"
          />
        </View>
      )}

      {/* Telemetry Bar */}
      <View style={[styles.statsRow, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
        <View style={styles.statPill}>
          <Text style={[styles.statLabel, { color: textMuted }]}>PAIRES</Text>
          <Text style={[styles.statVal, { color: accent }]}>
            {matchesFound} / {totalPairs}
          </Text>
        </View>
        <View style={styles.statPill}>
          <Text style={[styles.statLabel, { color: textMuted }]}>COUPS</Text>
          <Text style={[styles.statVal, { color: textPrimary }]}>{movesCount}</Text>
        </View>
        <View style={styles.statPill}>
          <Text style={[styles.statLabel, { color: textMuted }]}>TEMPS</Text>
          <Text style={[styles.statVal, { color: textPrimary }]}>{elapsedSeconds}s</Text>
        </View>
      </View>

      {/* Cards Grid */}
      <View style={styles.grid}>
        {cards.map((card) => {
          const isFlipped = flippedCardIds.includes(card.id) || card.isMatched;

          return (
            <TouchableOpacity
              key={card.id}
              activeOpacity={0.7}
              disabled={card.isMatched || isEvaluating}
              onPress={() => handleCardPress(card.id)}
              style={[
                styles.card,
                band === 'BAND_A' ? styles.cardBandA : styles.cardStandard,
                {
                  backgroundColor: isFlipped ? cardFaceBg : cardBackBg,
                  borderColor: card.isMatched
                    ? '#22C55E'
                    : isFlipped
                    ? '#CBD5E1'
                    : band === 'BAND_A'
                    ? '#2B8200'
                    : '#1E40AF',
                },
              ]}
            >
              {isFlipped ? (
                <View style={styles.cardContent}>
                  <Text
                    style={[
                      styles.cardLabel,
                      { color: card.isMatched ? '#15803D' : textPrimary },
                      band === 'BAND_A' && styles.cardLabelBandA,
                    ]}
                    numberOfLines={4}
                  >
                    {card.label}
                  </Text>
                  {card.isMatched && <Text style={styles.matchedCheck}>✓</Text>}
                </View>
              ) : (
                <Text style={styles.cardCoverGlyph}>
                  {band === 'BAND_A' ? '⭐' : band === 'BAND_B' ? '⚡' : '🏛️'}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Victory Modal */}
      {gameResult && (
        <View
          style={[
            styles.victoryCard,
            { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: accent },
          ]}
        >
          <Text style={styles.victoryEmoji}>
            {band === 'BAND_A' ? '🌟' : band === 'BAND_B' ? '🔥' : '🎖️'}
          </Text>
          <Text style={[styles.victoryTitle, { color: textPrimary }]}>
            {band === 'BAND_A' ? 'MAGNIFIQUE !' : 'CHALLENGE TERMINÉ !'}
          </Text>
          <Text style={[styles.victoryMsg, { color: textMuted }]}>
            {gameResult.feedbackMessage}
          </Text>

          <View style={styles.rewardSummaryRow}>
            {band === 'BAND_A' ? (
              <View style={styles.rewardChip}>
                <Text style={styles.rewardChipText}>+{gameResult.starsEarned} Étoiles ⭐</Text>
              </View>
            ) : (
              <View style={styles.rewardChip}>
                <Text style={styles.rewardChipText}>+{gameResult.xpEarned} XP Gagnés ⚡</Text>
              </View>
            )}
            <View style={styles.rewardChip}>
              <Text style={styles.rewardChipText}>Score : {gameResult.session.score} pts</Text>
            </View>
          </View>

          <View style={styles.victoryBtnRow}>
            <TouchableOpacity onPress={initializeGame} style={[styles.btnAction, { backgroundColor: accent }]}>
              <Text style={styles.btnActionText}>REJOUER</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onExit}
              style={[styles.btnAction, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]}
            >
              <Text style={[styles.btnActionText, { color: textPrimary }]}>RETOUR</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  exitBtn: {
    padding: 8,
  },
  exitBtnText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  gameTitleText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  restartBtn: {
    padding: 8,
  },
  restartBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  mascotWrapper: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 400,
    padding: 10,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statPill: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 420,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 2,
    padding: 8,
  },
  cardBandA: {
    width: 105,
    height: 105,
    borderRadius: 20,
    borderBottomWidth: 5,
  },
  cardStandard: {
    width: 90,
    height: 96,
    borderRadius: 12,
    borderBottomWidth: 4,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 16,
  },
  cardLabelBandA: {
    fontSize: 13,
    fontWeight: '800',
  },
  matchedCheck: {
    position: 'absolute',
    top: -2,
    right: -2,
    color: '#16A34A',
    fontWeight: '900',
    fontSize: 12,
  },
  cardCoverGlyph: {
    fontSize: 28,
  },
  victoryCard: {
    marginTop: 20,
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  victoryEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  victoryTitle: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  victoryMsg: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  rewardSummaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 14,
  },
  rewardChip: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  rewardChipText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '800',
  },
  victoryBtnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 6,
  },
  btnAction: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
