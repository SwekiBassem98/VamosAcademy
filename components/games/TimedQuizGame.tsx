import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import type { AgeBand } from '../../theme/types.ts';
import type { TimedQuizQuestion, GameResultSummary } from '../../lib/exercises/gameTypes.ts';
import { getTimedQuizForBand } from '../../lib/exercises/gameContent.ts';
import { recordGameSession } from '../../lib/exercises/api.ts';
import { useProgressStore } from '../../store/progressStore.ts';
import { useGameStore } from '../../store/gameStore.ts';
import { AnimatedMascot } from '../band-a/AnimatedMascot.tsx';
import { ClassLeaderboardModal } from './ClassLeaderboardModal.tsx';

interface Props {
  band: AgeBand;
  studentId?: string;
  gameId: string;
  gameTitle?: string;
  questionCount?: number;
  onFinish?: (result: GameResultSummary) => void;
  onExit: () => void;
  isDark?: boolean;
}

export function TimedQuizGame({
  band,
  studentId = 'student_current',
  gameId,
  gameTitle,
  questionCount = 5,
  onFinish,
  onExit,
  isDark = false,
}: Props) {
  const [questions, setQuestions] = useState<TimedQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [questionAttempts, setQuestionAttempts] = useState<
    {
      exerciseId?: string;
      isCorrect: boolean;
      studentAnswer: string;
      timeTakenSeconds: number;
    }[]
  >([]);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [gameResult, setGameResult] = useState<GameResultSummary | null>(null);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);

  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(Date.now());
  const questionStartTimeRef = useRef<number>(Date.now());

  const addStars = useProgressStore((s) => s.addStars);
  const addXp = useProgressStore((s) => s.addXp);
  const markExerciseComplete = useProgressStore((s) => s.markExerciseComplete);
  const updateHighScore = useGameStore((s) => s.updateHighScore);

  // Initialize questions
  const initializeGame = () => {
    const loaded = getTimedQuizForBand(band, questionCount);
    setQuestions(loaded);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerRevealed(false);
    setStreak(0);
    setScore(0);
    setCorrectCount(0);
    setQuestionAttempts([]);
    setIsCelebrating(false);
    setShowHint(false);
    setGameResult(null);

    if (loaded.length > 0) {
      setTimeLeft(loaded[0].timeLimitSeconds);
    }
    startTimeRef.current = Date.now();
    questionStartTimeRef.current = Date.now();
  };

  useEffect(() => {
    initializeGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [band, gameId]);

  const currentQ = questions[currentIndex];

  // Countdown timer effect
  useEffect(() => {
    if (!currentQ || isAnswerRevealed || gameResult) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isAnswerRevealed, gameResult]);

  // Handle Timeout
  const handleTimeOut = () => {
    if (isAnswerRevealed) return;
    setIsAnswerRevealed(true);
    setStreak(0);

    const timeSpent = currentQ?.timeLimitSeconds || 10;
    const attempt = {
      exerciseId: currentQ?.exerciseId,
      isCorrect: false,
      studentAnswer: 'TIMEOUT',
      timeTakenSeconds: timeSpent,
    };
    setQuestionAttempts((prev) => [...prev, attempt]);

    // Delay before next question
    setTimeout(() => {
      advanceNextQuestion();
    }, band === 'BAND_A' ? 2000 : 1200);
  };

  // Option selection
  const handleSelectOption = (optionId: string) => {
    if (isAnswerRevealed || !currentQ) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setSelectedOptionId(optionId);
    setIsAnswerRevealed(true);

    const isCorrect = optionId === currentQ.correctOptionId;
    const timeSpent = Math.max(
      1,
      Math.round((Date.now() - questionStartTimeRef.current) / 1000)
    );

    let earnedScore = 0;
    if (isCorrect) {
      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);
      const newStreak = streak + 1;
      setStreak(newStreak);

      // Score formula: base points + speed bonus + streak multiplier
      const streakMultiplier = Math.min(3, 1 + newStreak * 0.2);
      const speedBonus = Math.max(0, (currentQ.timeLimitSeconds - timeSpent) * 15);
      earnedScore = Math.round((currentQ.points * 10 + speedBonus) * streakMultiplier);
      setScore((s) => s + earnedScore);

      if (band === 'BAND_A') {
        setIsCelebrating(true);
        setTimeout(() => setIsCelebrating(false), 1200);
      }
    } else {
      setStreak(0);
    }

    setQuestionAttempts((prev) => [
      ...prev,
      {
        exerciseId: currentQ.exerciseId,
        isCorrect,
        studentAnswer: optionId,
        timeTakenSeconds: timeSpent,
      },
    ]);

    // Delay before moving to next question (forgiving for Band A)
    const reviewDelay = band === 'BAND_A' ? 2200 : band === 'BAND_B' ? 1400 : 900;
    setTimeout(() => {
      advanceNextQuestion();
    }, reviewDelay);
  };

  const advanceNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerRevealed(false);
      setShowHint(false);
      setTimeLeft(questions[currentIndex + 1].timeLimitSeconds);
      questionStartTimeRef.current = Date.now();
    } else {
      finalizeGame();
    }
  };

  const finalizeGame = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const duration = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));

    const result = await recordGameSession({
      studentId,
      gameId,
      gameType: band === 'BAND_C' ? 'bac_blitz' : 'speed_trivia',
      bandTarget: band,
      score,
      durationSeconds: duration,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      questionAttempts,
    });

    updateHighScore(gameId, score);
    if (band === 'BAND_A') {
      addStars(result.starsEarned);
    } else {
      addXp(result.xpEarned);
    }
    markExerciseComplete(gameId, result.accuracyRate);

    setGameResult(result);
    if (onFinish) onFinish(result);
  };

  // Styling
  const bg =
    band === 'BAND_A'
      ? '#FEF9F6'
      : band === 'BAND_B'
      ? isDark
        ? '#0B1120'
        : '#F8FAFC'
      : isDark
      ? '#090D16'
      : '#F8FAFC';

  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const borderCol = isDark ? '#334155' : '#E2E8F0';
  const textPrimary = isDark ? '#F8FAFC' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';
  const accent =
    band === 'BAND_A' ? '#FF6B4A' : band === 'BAND_B' ? '#3B82F6' : isDark ? '#38BDF8' : '#0284C7';

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={styles.content}>
      {/* Header Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onExit} style={styles.exitBtn}>
          <Text style={[styles.exitBtnText, { color: textPrimary }]}>✕ QUITTER</Text>
        </TouchableOpacity>
        <Text style={[styles.gameTitle, { color: textPrimary }]}>
          {gameTitle || (band === 'BAND_C' ? 'BACCALAURÉAT BLITZ' : 'BEAT THE CLOCK')}
        </Text>
        <TouchableOpacity
          onPress={() => setLeaderboardVisible(true)}
          style={[styles.leaderboardBtn, { borderColor: borderCol }]}
        >
          <Text style={styles.leaderboardBtnText}>🏆 RANG</Text>
        </TouchableOpacity>
      </View>

      {/* Band A Mascot Celebration */}
      {band === 'BAND_A' && (
        <View style={styles.mascotWrapper}>
          <AnimatedMascot
            isCelebrating={isCelebrating}
            celebrationMessage="EXCELLENT ! ⭐"
            size="medium"
          />
        </View>
      )}

      {/* Telemetry & Timer HUD */}
      {!gameResult && currentQ && (
        <View style={[styles.hudCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <View style={styles.hudTop}>
            <View style={styles.hudQuestionCount}>
              <Text style={[styles.hudCountText, { color: textMuted }]}>
                QUESTION {currentIndex + 1} / {questions.length}
              </Text>
              <Text style={[styles.hudSubjectText, { color: accent }]}>
                {currentQ.subjectName.toUpperCase()}
              </Text>
            </View>

            {/* Timer Badge */}
            <View
              style={[
                styles.timerBadge,
                {
                  backgroundColor:
                    timeLeft <= 3 ? '#FEE2E2' : band === 'BAND_A' ? '#FEF3C7' : '#E0F2FE',
                  borderColor:
                    timeLeft <= 3 ? '#EF4444' : band === 'BAND_A' ? '#F59E0B' : '#0284C7',
                },
              ]}
            >
              <Text
                style={[
                  styles.timerText,
                  {
                    color:
                      timeLeft <= 3 ? '#DC2626' : band === 'BAND_A' ? '#B45309' : '#0369A1',
                  },
                ]}
              >
                ⏱️ {timeLeft}s
              </Text>
            </View>
          </View>

          {/* Combo Streak & Live Score */}
          <View style={styles.hudBottom}>
            <View style={styles.streakBox}>
              <Text style={[styles.streakText, { color: streak > 1 ? '#EA580C' : textMuted }]}>
                {streak > 1 ? `🔥 ${streak}x COMBO !` : 'Série en cours'}
              </Text>
            </View>
            <Text style={[styles.liveScoreText, { color: textPrimary }]}>
              {score} PTS
            </Text>
          </View>
        </View>
      )}

      {/* Active Question Prompt */}
      {!gameResult && currentQ && (
        <View style={[styles.questionCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
          <Text style={[styles.promptText, { color: textPrimary }]}>{currentQ.prompt}</Text>

          {/* Band A Hint Button */}
          {band === 'BAND_A' && currentQ.hint && (
            <TouchableOpacity
              onPress={() => setShowHint(!showHint)}
              style={styles.hintToggleBtn}
            >
              <Text style={styles.hintToggleText}>
                {showHint ? '💡 Masquer l’indice' : '💡 Besoin d’un indice ?'}
              </Text>
            </TouchableOpacity>
          )}

          {showHint && currentQ.hint && (
            <View style={styles.hintBox}>
              <Text style={styles.hintContentText}>{currentQ.hint}</Text>
            </View>
          )}

          {/* Options Grid */}
          <View style={styles.optionsList}>
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrectOpt = opt.isCorrect;

              let btnBg = cardBg;
              let borderC = borderCol;
              let txtColor = textPrimary;

              if (isAnswerRevealed) {
                if (isCorrectOpt) {
                  btnBg = isDark ? '#064E3B' : '#DCFCE7';
                  borderC = '#22C55E';
                  txtColor = isDark ? '#6EE7B7' : '#15803D';
                } else if (isSelected && !isCorrectOpt) {
                  btnBg = isDark ? '#7F1D1D' : '#FEE2E2';
                  borderC = '#EF4444';
                  txtColor = isDark ? '#FCA5A5' : '#B91C1C';
                }
              } else if (isSelected) {
                borderC = accent;
              }

              return (
                <TouchableOpacity
                  key={opt.id}
                  disabled={isAnswerRevealed}
                  onPress={() => handleSelectOption(opt.id)}
                  activeOpacity={0.7}
                  style={[
                    styles.optionBtn,
                    band === 'BAND_A' ? styles.optionBtnBandA : styles.optionBtnStandard,
                    { backgroundColor: btnBg, borderColor: borderC },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: txtColor },
                      band === 'BAND_A' && styles.optionLabelBandA,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Explanation during review */}
          {isAnswerRevealed && (
            <View
              style={[
                styles.explanationBox,
                { backgroundColor: isDark ? '#0F172A' : '#F1F5F9', borderColor: borderCol },
              ]}
            >
              <Text style={[styles.explanationLabel, { color: accent }]}>EXPLICATION :</Text>
              <Text style={[styles.explanationText, { color: textMuted }]}>
                {currentQ.explanation}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Game Over Summary */}
      {gameResult && (
        <View
          style={[
            styles.resultCard,
            { backgroundColor: cardBg, borderColor: accent },
          ]}
        >
          <Text style={styles.resultTrophyEmoji}>
            {band === 'BAND_A' ? '🌟' : band === 'BAND_B' ? '⚡' : '🏛️'}
          </Text>
          <Text style={[styles.resultTitle, { color: textPrimary }]}>
            {band === 'BAND_A'
              ? 'DÉFI DES ÉTOILES RÉUSSI !'
              : band === 'BAND_B'
              ? 'VANGUARD SPRINT TERMINÉ !'
              : 'ÉPREUVE RAPIDE VALIDÉE !'}
          </Text>
          <Text style={[styles.resultMsg, { color: textMuted }]}>
            {gameResult.feedbackMessage}
          </Text>

          {/* Stats breakdown */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: accent }]}>
                {correctCount} / {questions.length}
              </Text>
              <Text style={[styles.metricLabel, { color: textMuted }]}>RÉPONSES JUSTES</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: textPrimary }]}>
                {gameResult.accuracyRate}%
              </Text>
              <Text style={[styles.metricLabel, { color: textMuted }]}>PRÉCISION</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricVal, { color: '#EAB308' }]}>
                {gameResult.session.score}
              </Text>
              <Text style={[styles.metricLabel, { color: textMuted }]}>SCORE FINAL</Text>
            </View>
          </View>

          {/* Band C Leaderboard rank callout */}
          {band === 'BAND_C' && (
            <TouchableOpacity
              onPress={() => setLeaderboardVisible(true)}
              style={styles.leaderboardCallout}
            >
              <Text style={styles.leaderboardCalloutEmoji}>🏆</Text>
              <View style={styles.leaderboardCalloutInfo}>
                <Text style={styles.leaderboardCalloutTitle}>
                  Votre rang national : #{gameResult.leaderboardRank}
                </Text>
                <Text style={styles.leaderboardCalloutSub}>
                  Touchez pour voir le classement complet des Lycées Pilotes ➔
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={initializeGame}
              style={[styles.btnAction, { backgroundColor: accent }]}
            >
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

      {/* Class & National Leaderboard Modal */}
      <ClassLeaderboardModal
        visible={leaderboardVisible}
        onClose={() => setLeaderboardVisible(false)}
        gameId={gameId}
        band={band}
        studentScore={score}
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
    padding: 6,
  },
  exitBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  gameTitle: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  leaderboardBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  leaderboardBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EAB308',
  },
  mascotWrapper: {
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  hudCard: {
    width: '100%',
    maxWidth: 500,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  hudTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hudQuestionCount: {
    gap: 2,
  },
  hudCountText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  hudSubjectText: {
    fontSize: 12,
    fontWeight: '900',
  },
  timerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  hudBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  streakBox: {},
  streakText: {
    fontSize: 12,
    fontWeight: '800',
  },
  liveScoreText: {
    fontSize: 15,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  questionCard: {
    width: '100%',
    maxWidth: 500,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  promptText: {
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 12,
  },
  hintToggleBtn: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  hintToggleText: {
    fontSize: 12,
    color: '#EA580C',
    fontWeight: '700',
  },
  hintBox: {
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCD34D',
    marginBottom: 12,
  },
  hintContentText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
  },
  optionsList: {
    gap: 10,
  },
  optionBtn: {
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBtnBandA: {
    minHeight: 56,
    borderBottomWidth: 4,
    borderRadius: 16,
  },
  optionBtnStandard: {
    minHeight: 48,
    borderBottomWidth: 3,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  optionLabelBandA: {
    fontSize: 15,
    fontWeight: '800',
  },
  explanationBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  explanationLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  explanationText: {
    fontSize: 12,
    lineHeight: 18,
  },
  resultCard: {
    width: '100%',
    maxWidth: 500,
    padding: 20,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
  },
  resultTrophyEmoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  resultMsg: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '900',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  leaderboardCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    width: '100%',
    gap: 10,
    marginBottom: 16,
  },
  leaderboardCalloutEmoji: {
    fontSize: 24,
  },
  leaderboardCalloutInfo: {
    flex: 1,
  },
  leaderboardCalloutTitle: {
    color: '#0369A1',
    fontSize: 13,
    fontWeight: '800',
  },
  leaderboardCalloutSub: {
    color: '#0284C7',
    fontSize: 11,
    marginTop: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btnAction: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
