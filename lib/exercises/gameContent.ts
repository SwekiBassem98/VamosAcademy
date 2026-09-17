import type { AgeBand } from '../../theme/types.ts';
import type { MatchingPairsExercise, MultipleChoiceExercise, SubjectCode } from './types.ts';
import type { MemoryCard, TimedQuizQuestion, LeaderboardEntry } from './gameTypes.ts';
import { CURRICULUM_EXERCISES } from './curriculum.ts';

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Extracts and prepares memory matching cards reusing MatchingPairs exercises
 * from the exercises engine's curriculum.
 */
export function getMemoryCardsForBand(
  band: AgeBand,
  customPairCount?: number
): MemoryCard[] {
  // Find all matching pairs exercises available for this band
  const matchingExercises = CURRICULUM_EXERCISES.filter(
    (ex): ex is MatchingPairsExercise =>
      ex.exerciseType === 'matching_pairs' && ex.targetBand === band
  );

  // Fallback to any matching pairs if none for this band
  const sourcePool =
    matchingExercises.length > 0
      ? matchingExercises
      : (CURRICULUM_EXERCISES.filter(
          (ex): ex is MatchingPairsExercise => ex.exerciseType === 'matching_pairs'
        ) as MatchingPairsExercise[]);

  // Collect all raw pairs
  const rawPairs: {
    pairId: string;
    left: string;
    right: string;
    subject: SubjectCode;
  }[] = [];

  for (const ex of sourcePool) {
    for (const p of ex.pairs) {
      rawPairs.push({
        pairId: `${ex.id}_${p.id}`,
        left: p.left,
        right: p.right,
        subject: ex.subject,
      });
    }
  }

  // Band-tuned pair counts:
  // Band A: 3 pairs (6 cards) — simplified, large and accessible
  // Band B: 4 pairs (8 cards) — standard challenge
  // Band C: 5 pairs (10 cards) — dense academic concepts
  const targetPairCount =
    customPairCount ?? (band === 'BAND_A' ? 3 : band === 'BAND_B' ? 4 : 5);

  const selectedPairs = shuffle(rawPairs).slice(0, targetPairCount);

  // Generate individual card items (one for left, one for right)
  const cards: MemoryCard[] = [];
  for (const item of selectedPairs) {
    cards.push({
      id: `${item.pairId}_left`,
      pairId: item.pairId,
      label: item.left,
      subject: item.subject,
      side: 'left',
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      id: `${item.pairId}_right`,
      pairId: item.pairId,
      label: item.right,
      subject: item.subject,
      side: 'right',
      isFlipped: false,
      isMatched: false,
    });
  }

  return shuffle(cards);
}

/**
 * Extracts and prepares timed quiz questions reusing Multiple Choice exercises
 * from the exercises engine's curriculum.
 */
export function getTimedQuizForBand(
  band: AgeBand,
  limit = 5
): TimedQuizQuestion[] {
  const mcExercises = CURRICULUM_EXERCISES.filter(
    (ex): ex is MultipleChoiceExercise =>
      ex.exerciseType === 'multiple_choice' && ex.targetBand === band
  );

  const sourcePool =
    mcExercises.length > 0
      ? mcExercises
      : (CURRICULUM_EXERCISES.filter(
          (ex): ex is MultipleChoiceExercise => ex.exerciseType === 'multiple_choice'
        ) as MultipleChoiceExercise[]);

  const pool = shuffle(sourcePool);
  const selected: MultipleChoiceExercise[] = [];
  while (selected.length < limit && pool.length > 0) {
    for (const item of pool) {
      if (selected.length < limit) {
        selected.push(item);
      }
    }
  }

  // Band-specific timing adjustments:
  // Band A: 30 seconds per question (very forgiving, relaxed exploration)
  // Band B: 15 seconds per question (Vanguard speed pulse)
  // Band C: 8 seconds per question (harder/faster Baccalaureate blitz)
  const timeLimitSeconds = band === 'BAND_A' ? 30 : band === 'BAND_B' ? 15 : 8;

  return selected.map((ex) => {
    const correctOpt = ex.options.find((o) => o.isCorrect) || ex.options[0];
    return {
      id: `quiz_${ex.id}`,
      exerciseId: ex.id,
      prompt: ex.prompt,
      subject: ex.subject,
      subjectName: ex.subjectName,
      options: shuffle(ex.options),
      correctOptionId: correctOpt.id,
      explanation: ex.explanation,
      points: ex.points,
      xpAwarded: ex.xpAwarded,
      starsAwarded: ex.starsAwarded,
      timeLimitSeconds,
      hint: ex.hints?.[0] || 'Observe attentivement les indices de la question.',
    };
  });
}

/**
 * Global and Class Leaderboard generator for competitive games (Band C & Band B).
 */
export function getGameLeaderboard(
  gameId: string,
  band: AgeBand,
  studentScore?: number,
  studentName = 'Senior Scholar Bassem'
): LeaderboardEntry[] {
  // Pre-seeded peer scholars representing top Tunisian Lycées Pilotes and Vamos Academy classes
  const baseEntries: Omit<LeaderboardEntry, 'rank' | 'isCurrentStudent'>[] = [
    {
      studentId: 'peer_1',
      studentName: 'Yasmine Ben Amor',
      schoolOrCity: 'Lycée Pilote Bourguiba (Tunis)',
      score: 3120,
      accuracy: 98.4,
      timeSeconds: 44,
    },
    {
      studentId: 'peer_2',
      studentName: 'Amine Khemir',
      schoolOrCity: 'Lycée Pilote de l’Ariana',
      score: 2950,
      accuracy: 96.0,
      timeSeconds: 51,
    },
    {
      studentId: 'peer_3',
      studentName: 'Nour Trabelsi',
      schoolOrCity: 'Lycée Pilote de Sousse',
      score: 2840,
      accuracy: 94.5,
      timeSeconds: 55,
    },
    {
      studentId: 'peer_4',
      studentName: 'Mohamed Ali Gharbi',
      schoolOrCity: 'Lycée Pilote de Sfax',
      score: 2680,
      accuracy: 92.0,
      timeSeconds: 59,
    },
    {
      studentId: 'peer_5',
      studentName: 'Salma Mansour',
      schoolOrCity: 'Lycée Pilote Menzah 8',
      score: 2420,
      accuracy: 90.5,
      timeSeconds: 62,
    },
    {
      studentId: 'peer_6',
      studentName: 'Fares Bouazizi',
      schoolOrCity: 'Lycée Pilote de Monastir',
      score: 2210,
      accuracy: 88.0,
      timeSeconds: 68,
    },
  ];

  const currentScore = studentScore ?? 2750;
  const currentStudentEntry: Omit<LeaderboardEntry, 'rank' | 'isCurrentStudent'> = {
    studentId: 'current_student',
    studentName,
    schoolOrCity: 'Lycée Pilote de Sousse • Classe Bac Math',
    score: currentScore,
    accuracy: 95.0,
    timeSeconds: 48,
  };

  const allEntries = [...baseEntries, currentStudentEntry].sort((a, b) => b.score - a.score);

  return allEntries.map((item, idx) => ({
    ...item,
    rank: idx + 1,
    isCurrentStudent: item.studentId === 'current_student',
  }));
}
