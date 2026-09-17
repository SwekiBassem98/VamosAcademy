import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import type {
  Exercise,
  ExerciseEvaluationResult,
  MatchingPairsExercise,
  FillInTheBlankExercise,
  MultipleChoiceExercise,
  ShortAnswerExercise,
} from '../../lib/exercises/types.ts';
import { submitExerciseAttempt } from '../../lib/exercises/api.ts';
import { ExerciseFeedbackModal } from './ExerciseFeedbackModal.tsx';
import { useProgressStore } from '../../store/progressStore.ts';
import { BAND_A_THEME, BAND_B_THEME, BAND_C_THEME } from '../../theme/tokens.ts';

interface ExercisePlayerProps {
  exercise: Exercise;
  studentId?: string;
  onFinished?: (result: ExerciseEvaluationResult) => void;
  onExit?: () => void;
}

export const ExercisePlayer: React.FC<ExercisePlayerProps> = ({
  exercise,
  studentId = 'student-active-user',
  onFinished,
  onExit,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<ExerciseEvaluationResult | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // State per exercise type
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [blanksState, setBlanksState] = useState<Record<string, string>>({});
  const [matchingPairsState, setMatchingPairsState] = useState<Record<string, string>>({});
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [shortAnswerText, setShortAnswerText] = useState<string>('');

  // Stores
  const addStars = useProgressStore((s) => s.addStars);
  const addXp = useProgressStore((s) => s.addXp);
  const incrementStreak = useProgressStore((s) => s.incrementStreak);
  const markExerciseComplete = useProgressStore((s) => s.markExerciseComplete);
  const metrics = useProgressStore((s) => s.metrics);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const band = exercise.targetBand;
  const theme = band === 'BAND_A' ? BAND_A_THEME : band === 'BAND_B' ? BAND_B_THEME : BAND_C_THEME;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let studentAnswer: any = '';

    switch (exercise.exerciseType) {
      case 'multiple_choice':
        studentAnswer = selectedOptionId;
        break;
      case 'fill_in_the_blank':
        studentAnswer = blanksState;
        break;
      case 'matching_pairs':
        studentAnswer = matchingPairsState;
        break;
      case 'short_answer':
        studentAnswer = shortAnswerText;
        break;
    }

    try {
      const result = await submitExerciseAttempt(
        {
          studentId,
          exerciseId: exercise.id,
          studentAnswer,
          timeTakenSeconds: Math.max(1, elapsedSeconds),
        },
        {
          currentStreak: metrics.streakDays,
          currentXp: metrics.xp,
          currentAccuracy: metrics.accuracyRate,
          currentBacReadiness: metrics.bacReadinessScore,
        }
      );

      // Apply band progress updates
      if (band === 'BAND_A') {
        const stars = result.feedbackPayload.bandA?.starsEarned ?? (result.isCorrect ? 3 : 1);
        addStars(stars);
      } else if (band === 'BAND_B') {
        const xp = result.feedbackPayload.bandB?.xpGained ?? 50;
        addXp(xp);
        if (result.isCorrect) {
          incrementStreak();
        }
      }

      markExerciseComplete(exercise.id, result.accuracyPercentage);

      setEvaluationResult(result);
      setShowFeedbackModal(true);
      if (onFinished) {
        onFinished(result);
      }
    } catch (err) {
      console.error('Failed to submit exercise attempt:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeftPairClick = (leftId: string) => {
    setSelectedLeftId(leftId);
  };

  const handleRightPairClick = (rightText: string) => {
    if (selectedLeftId) {
      setMatchingPairsState((prev) => ({
        ...prev,
        [selectedLeftId]: rightText,
      }));
      setSelectedLeftId(null);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {/* Top Bar Header */}
      <View style={styles.headerRow}>
        <View style={styles.subjectBadge}>
          <Text style={styles.subjectBadgeText}>{exercise.subjectName.toUpperCase()}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.timerText}>⏱ {elapsedSeconds}s</Text>
          {onExit && (
            <TouchableOpacity onPress={onExit} style={styles.exitBtn}>
              <Text style={styles.exitBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Title & Level */}
      <View style={styles.titleCard}>
        <Text style={[styles.levelLabel, { color: theme.colors.primary }]}>
          {exercise.levelCode} • {exercise.exerciseType.replace(/_/g, ' ').toUpperCase()}
        </Text>
        <Text style={[styles.exerciseTitle, { color: theme.colors.textPrimary }]}>
          {exercise.title}
        </Text>
        <Text style={[styles.promptText, { color: theme.colors.textSecondary }]}>
          {exercise.prompt}
        </Text>
      </View>

      {/* ========================================================= */}
      {/* TYPE 1: MULTIPLE CHOICE                                    */}
      {/* ========================================================= */}
      {exercise.exerciseType === 'multiple_choice' && (
        <View style={styles.optionsList}>
          {(exercise as MultipleChoiceExercise).options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.optionCard,
                  isSelected && {
                    borderColor: theme.colors.primary,
                    backgroundColor: band === 'BAND_A' ? '#FED7AA' : 'rgba(56, 189, 248, 0.1)',
                  },
                ]}
                onPress={() => setSelectedOptionId(opt.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.radioCircle,
                    isSelected && { borderColor: theme.colors.primary, backgroundColor: theme.colors.primary },
                  ]}
                />
                <Text
                  style={[
                    styles.optionText,
                    isSelected && { fontWeight: '700', color: theme.colors.textPrimary },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* ========================================================= */}
      {/* TYPE 2: FILL IN THE BLANK                                  */}
      {/* ========================================================= */}
      {exercise.exerciseType === 'fill_in_the_blank' && (
        <View style={styles.fillBlankContainer}>
          <Text style={styles.fillBlankTemplate}>
            {(exercise as FillInTheBlankExercise).template}
          </Text>
          <View style={styles.blanksInputsWrapper}>
            {(exercise as FillInTheBlankExercise).blanks.map((b, i) => (
              <View key={b.id} style={styles.blankInputRow}>
                <Text style={styles.blankInputLabel}>
                  Champ {i + 1} ({b.placeholder || 'mot manquant'}) :
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={blanksState[b.id] || ''}
                  onChangeText={(val) =>
                    setBlanksState((prev) => ({ ...prev, [b.id]: val }))
                  }
                  placeholder="Écris ta réponse ici..."
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="none"
                />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ========================================================= */}
      {/* TYPE 3: MATCHING PAIRS                                     */}
      {/* ========================================================= */}
      {exercise.exerciseType === 'matching_pairs' && (
        <View style={styles.matchingContainer}>
          <Text style={styles.matchingInstruction}>
            Touche un élément à gauche, puis touche son correspondant à droite :
          </Text>
          <View style={styles.matchingColumnsRow}>
            {/* Left Items */}
            <View style={styles.matchingCol}>
              <Text style={styles.colHeader}>Élément</Text>
              {(exercise as MatchingPairsExercise).pairs.map((p) => {
                const isSelected = selectedLeftId === p.id;
                const isMatched = Boolean(matchingPairsState[p.id]);
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[
                      styles.matchingCard,
                      isSelected && styles.matchingCardSelected,
                      isMatched && styles.matchingCardMatched,
                    ]}
                    onPress={() => handleLeftPairClick(p.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.matchingCardText}>{p.left}</Text>
                    {isMatched && (
                      <Text style={styles.matchedBadge}>
                        ➔ {matchingPairsState[p.id]}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Right Items */}
            <View style={styles.matchingCol}>
              <Text style={styles.colHeader}>Correspondance</Text>
              {(exercise as MatchingPairsExercise).pairs.map((p) => {
                return (
                  <TouchableOpacity
                    key={`right_${p.id}`}
                    style={styles.matchingRightCard}
                    onPress={() => handleRightPairClick(p.right)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.matchingCardText}>{p.right}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}

      {/* ========================================================= */}
      {/* TYPE 4: SHORT FREE-TEXT ANSWER                            */}
      {/* ========================================================= */}
      {exercise.exerciseType === 'short_answer' && (
        <View style={styles.shortAnswerContainer}>
          <Text style={styles.shortAnswerLabel}>Ta réponse / Résultat :</Text>
          <TextInput
            style={[styles.textInput, styles.shortAnswerInput]}
            value={shortAnswerText}
            onChangeText={setShortAnswerText}
            placeholder="Saisis ton calcul, mot ou réponse finale..."
            placeholderTextColor="#94A3B8"
            multiline
          />
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitBtn,
          { backgroundColor: theme.colors.primary },
          isSubmitting && styles.btnDisabled,
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting}
        activeOpacity={0.8}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitBtnText}>
            Valider la réponse ➔
          </Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />

      {/* Band Feedback Results Modal */}
      <ExerciseFeedbackModal
        visible={showFeedbackModal}
        result={evaluationResult}
        onClose={() => setShowFeedbackModal(false)}
        onNext={() => setShowFeedbackModal(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subjectBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#334155',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  exitBtn: {
    padding: 4,
  },
  exitBtnText: {
    fontSize: 16,
    color: '#64748B',
  },
  titleCard: {
    marginBottom: 16,
  },
  levelLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  promptText: {
    fontSize: 14,
    lineHeight: 20,
  },
  optionsList: {
    gap: 8,
    marginVertical: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#94A3B8',
  },
  optionText: {
    fontSize: 14,
    color: '#1E293B',
    flex: 1,
  },
  fillBlankContainer: {
    marginVertical: 10,
  },
  fillBlankTemplate: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  blanksInputsWrapper: {
    gap: 10,
  },
  blankInputRow: {
    gap: 4,
  },
  blankInputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  matchingContainer: {
    marginVertical: 10,
  },
  matchingInstruction: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
  },
  matchingColumnsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  matchingCol: {
    flex: 1,
    gap: 8,
  },
  colHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 4,
  },
  matchingCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
    minHeight: 52,
    justifyContent: 'center',
  },
  matchingCardSelected: {
    borderColor: '#0284C7',
    backgroundColor: 'rgba(2, 132, 199, 0.1)',
  },
  matchingCardMatched: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  matchingRightCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    minHeight: 52,
    justifyContent: 'center',
  },
  matchingCardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  matchedBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
    marginTop: 4,
  },
  shortAnswerContainer: {
    marginVertical: 10,
    gap: 6,
  },
  shortAnswerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  shortAnswerInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
