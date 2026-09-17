import type {
  Exercise,
  MultipleChoiceExercise,
  FillInTheBlankExercise,
  MatchingPairsExercise,
  ShortAnswerExercise,
  StudentAttemptSubmission,
  ExerciseEvaluationResult,
  BandFeedbackPayload,
  ExerciseAttemptRecord,
} from './types.ts';
import type { AgeBand } from '../../theme/types.ts';

/**
 * Normalizes text for comparison (trims whitespace, converts to lowercase,
 * collapses multiple whitespace spaces).
 */
export function normalizeAnswer(str: string): string {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/**
 * Evaluates Multiple Choice exercises.
 * Supports single selection or multi-selection array.
 */
export function evaluateMultipleChoice(
  exercise: MultipleChoiceExercise,
  studentAnswer: string | string[]
): { isCorrect: boolean; score: number; maxScore: number } {
  const correctOptionIds = exercise.options.filter((o) => o.isCorrect).map((o) => o.id);
  const maxScore = exercise.points;

  if (Array.isArray(studentAnswer)) {
    const selected = new Set(studentAnswer);
    const correct = new Set(correctOptionIds);
    const isPerfect = selected.size === correct.size && [...selected].every((id) => correct.has(id));
    return {
      isCorrect: isPerfect,
      score: isPerfect ? maxScore : 0,
      maxScore,
    };
  }

  // Single selection
  const isMatch = correctOptionIds.includes(String(studentAnswer));
  return {
    isCorrect: isMatch,
    score: isMatch ? maxScore : 0,
    maxScore,
  };
}

/**
 * Evaluates Fill in the Blank exercises.
 * studentAnswer can be a map of blank id -> text, or an ordered array of strings.
 */
export function evaluateFillInTheBlank(
  exercise: FillInTheBlankExercise,
  studentAnswer: Record<string, string> | string[] | string
): { isCorrect: boolean; score: number; maxScore: number; correctBlanksCount: number } {
  const maxScore = exercise.points;
  let correctCount = 0;

  exercise.blanks.forEach((blank, idx) => {
    let studentInput = '';
    if (typeof studentAnswer === 'object' && studentAnswer !== null && !Array.isArray(studentAnswer)) {
      studentInput = studentAnswer[blank.id] || '';
    } else if (Array.isArray(studentAnswer)) {
      studentInput = studentAnswer[idx] || '';
    } else if (typeof studentAnswer === 'string' && exercise.blanks.length === 1) {
      studentInput = studentAnswer;
    }

    const cleanedStudent = blank.caseSensitive ? studentInput.trim() : normalizeAnswer(studentInput);
    const match = blank.acceptedAnswers.some((accepted) => {
      const cleanedAccepted = blank.caseSensitive ? accepted.trim() : normalizeAnswer(accepted);
      return cleanedStudent === cleanedAccepted;
    });

    if (match) {
      correctCount++;
    }
  });

  const totalBlanks = exercise.blanks.length || 1;
  const isAllCorrect = correctCount === totalBlanks;
  const score = Math.round((correctCount / totalBlanks) * maxScore);

  return {
    isCorrect: isAllCorrect,
    score,
    maxScore,
    correctBlanksCount: correctCount,
  };
}

/**
 * Evaluates Matching Pairs exercises.
 * studentAnswer is a map of pairId (or left text) -> right text.
 */
export function evaluateMatchingPairs(
  exercise: MatchingPairsExercise,
  studentAnswer: Record<string, string>
): { isCorrect: boolean; score: number; maxScore: number; matchedPairsCount: number } {
  const maxScore = exercise.points;
  let correctPairs = 0;

  exercise.pairs.forEach((pair) => {
    // Check if student matched by pair ID or by left key
    const answeredRight = studentAnswer[pair.id] ?? studentAnswer[pair.left];
    if (answeredRight !== undefined && normalizeAnswer(answeredRight) === normalizeAnswer(pair.right)) {
      correctPairs++;
    }
  });

  const totalPairs = exercise.pairs.length || 1;
  const isAllCorrect = correctPairs === totalPairs;
  const score = Math.round((correctPairs / totalPairs) * maxScore);

  return {
    isCorrect: isAllCorrect,
    score,
    maxScore,
    matchedPairsCount: correctPairs,
  };
}

/**
 * Evaluates Short Answer free-text exercises.
 * Checks normalized student string against acceptedAnswers and optional numeric tolerance.
 */
export function evaluateShortAnswer(
  exercise: ShortAnswerExercise,
  studentAnswer: string
): { isCorrect: boolean; score: number; maxScore: number } {
  const maxScore = exercise.points;
  const rawInput = typeof studentAnswer === 'string' ? studentAnswer : String(studentAnswer ?? '');
  const cleanedStudent = exercise.caseSensitive ? rawInput.trim() : normalizeAnswer(rawInput);

  // Direct match against accepted answers
  const isExactOrNormalizedMatch = exercise.acceptedAnswers.some((ans) => {
    const cleanedAccepted = exercise.caseSensitive ? ans.trim() : normalizeAnswer(ans);
    return cleanedStudent === cleanedAccepted;
  });

  if (isExactOrNormalizedMatch) {
    return { isCorrect: true, score: maxScore, maxScore };
  }

  // If numeric answer check
  if (exercise.numericTolerance !== undefined) {
    const studentNum = parseFloat(cleanedStudent);
    if (!Number.isNaN(studentNum)) {
      const matchNumeric = exercise.acceptedAnswers.some((ans) => {
        const targetNum = parseFloat(ans);
        return !Number.isNaN(targetNum) && Math.abs(studentNum - targetNum) <= (exercise.numericTolerance ?? 0);
      });
      if (matchNumeric) {
        return { isCorrect: true, score: maxScore, maxScore };
      }
    }
  }

  // Check rubric keywords if provided
  if (exercise.rubricKeywords && exercise.rubricKeywords.length > 0) {
    const lowerInput = cleanedStudent.toLowerCase();
    const matchedKeywords = exercise.rubricKeywords.filter((kw) => lowerInput.includes(kw.toLowerCase()));
    if (matchedKeywords.length === exercise.rubricKeywords.length) {
      return { isCorrect: true, score: maxScore, maxScore };
    }
    if (matchedKeywords.length > 0) {
      const partialScore = Math.round((matchedKeywords.length / exercise.rubricKeywords.length) * maxScore);
      return { isCorrect: false, score: partialScore, maxScore };
    }
  }

  return { isCorrect: false, score: 0, maxScore };
}

/**
 * Master evaluation function for any exercise type.
 */
export function evaluateExerciseSubmission(
  exercise: Exercise,
  submission: StudentAttemptSubmission,
  currentContext?: {
    currentStreak?: number;
    currentXp?: number;
    currentAccuracy?: number;
    currentBacReadiness?: number;
  }
): ExerciseEvaluationResult {
  let isCorrect = false;
  let score = 0;
  let maxScore = exercise.points;

  switch (exercise.exerciseType) {
    case 'multiple_choice': {
      const res = evaluateMultipleChoice(exercise, submission.studentAnswer as string | string[]);
      isCorrect = res.isCorrect;
      score = res.score;
      maxScore = res.maxScore;
      break;
    }
    case 'fill_in_the_blank': {
      const res = evaluateFillInTheBlank(exercise, submission.studentAnswer as Record<string, string> | string[]);
      isCorrect = res.isCorrect;
      score = res.score;
      maxScore = res.maxScore;
      break;
    }
    case 'matching_pairs': {
      const res = evaluateMatchingPairs(exercise, submission.studentAnswer as Record<string, string>);
      isCorrect = res.isCorrect;
      score = res.score;
      maxScore = res.maxScore;
      break;
    }
    case 'short_answer': {
      const res = evaluateShortAnswer(exercise, String(submission.studentAnswer));
      isCorrect = res.isCorrect;
      score = res.score;
      maxScore = res.maxScore;
      break;
    }
  }

  const accuracyPercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : (isCorrect ? 100 : 0);

  // Construct attempt record
  const attemptRecord: ExerciseAttemptRecord = {
    id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    studentId: submission.studentId,
    exerciseId: exercise.id,
    isCorrect,
    score,
    maxScore,
    studentAnswer: typeof submission.studentAnswer === 'string'
      ? submission.studentAnswer
      : JSON.stringify(submission.studentAnswer),
    timeTakenSeconds: submission.timeTakenSeconds,
    completedAt: new Date().toISOString(),
  };

  // Generate band-specific feedback
  const feedbackPayload = generateBandFeedback(exercise, isCorrect, submission.timeTakenSeconds, currentContext);

  const detailedFeedback = isCorrect
    ? `Excellente réponse! ${exercise.explanation}`
    : `Ce n'est pas tout à fait correct. Explication: ${exercise.explanation}`;

  return {
    isCorrect,
    score,
    maxScore,
    accuracyPercentage,
    explanation: exercise.explanation,
    detailedFeedback,
    feedbackPayload,
    attemptRecord,
  };
}

/**
 * Generates band-specific presentation payload according to the prompt:
 * - Band A: big cheerful animation + sound
 * - Band B: XP gained + streak update
 * - Band C: accuracy stat updated, minimal animation
 */
export function generateBandFeedback(
  exercise: Exercise,
  isCorrect: boolean,
  timeTakenSeconds: number,
  context?: {
    currentStreak?: number;
    currentXp?: number;
    currentAccuracy?: number;
    currentBacReadiness?: number;
  }
): BandFeedbackPayload {
  const band = exercise.targetBand;
  const payload: BandFeedbackPayload = { band };

  if (band === 'BAND_A') {
    payload.bandA = {
      starsEarned: isCorrect ? exercise.starsAwarded : 1, // Band A always rewards effort
      cheerTitle: isCorrect ? '🌟 BRAVO ! TU ES UN CHAMPION !' : '💪 BEL EFFORT ! CONTINUE !',
      cheerMessage: isCorrect
        ? 'Youssef le Fennec saute de joie ! Tu as brillamment réussi cette mission !'
        : 'Ne t’inquiète pas, chaque erreur est une graine d’apprentissage avec Youssef !',
      mascotReaction: isCorrect ? 'celebrate' : 'encourage',
      soundCue: isCorrect ? 'fanfare_cheerful' : 'soft_boing',
      badgeEarned: isCorrect ? 'Étoile d’Or du Sahara' : undefined,
    };
  } else if (band === 'BAND_B') {
    const baseStreak = context?.currentStreak ?? 4;
    const newStreak = isCorrect ? baseStreak + 1 : baseStreak;
    const xpGained = isCorrect ? exercise.xpAwarded : Math.round(exercise.xpAwarded * 0.25);
    const currentXp = (context?.currentXp ?? 450) + xpGained;
    const currentLevel = Math.floor(currentXp / 250) + 1;
    const xpProgressPercent = Math.round(((currentXp % 250) / 250) * 100);

    payload.bandB = {
      xpGained,
      streakDays: newStreak,
      streakIncremented: isCorrect,
      level: currentLevel,
      xpProgressPercent,
      missionComplete: isCorrect,
    };
  } else {
    // BAND_C: Academic rigor & minimal animation
    const oldAcc = context?.currentAccuracy ?? 92.4;
    const delta = isCorrect ? +0.8 : -1.2;
    const updatedAccuracy = parseFloat((oldAcc + delta).toFixed(1));
    const bacDelta = isCorrect ? +0.5 : 0.0;
    const updatedBac = parseFloat(((context?.currentBacReadiness ?? 84.0) + bacDelta).toFixed(1));

    payload.bandC = {
      accuracyPercent: updatedAccuracy,
      accuracyDelta: delta,
      bacReadinessScore: updatedBac,
      timeTakenSeconds,
      markingRubric: `Barème Officiel Bac Tunisien — Critère d'évaluation respecté: ${exercise.points}/${exercise.points} pts`,
    };
  }

  return payload;
}
