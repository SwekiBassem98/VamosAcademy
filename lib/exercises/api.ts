import type {
  Exercise,
  SubjectCode,
  StudentAttemptSubmission,
  ExerciseEvaluationResult,
  ExerciseAttemptRecord,
  AcademicLevel,
} from './types.ts';
import type { AgeBand } from '../../theme/types.ts';
import type { GameSessionRecord, GameResultSummary, LeaderboardEntry, GameType } from './gameTypes.ts';
import { CURRICULUM_EXERCISES, ACADEMIC_LEVELS } from './curriculum.ts';
import { evaluateExerciseSubmission } from './evaluator.ts';
import { getGameLeaderboard } from './gameContent.ts';

export interface FetchExercisesParams {
  studentId?: string;
  subject?: SubjectCode | string;
  studentAcademicLevel?: number; // 1 to 10 scale (actual assessed level at the center)
  levelCode?: string;
  band?: AgeBand;
}

// In-memory backend attempt repository (persists during application lifecycle)
const ATTEMPTS_STORE: ExerciseAttemptRecord[] = [
  {
    id: 'att_seed_01',
    studentId: 'student-demo-01',
    exerciseId: 'ex-a-mc-01',
    isCorrect: true,
    score: 10,
    maxScore: 10,
    studentAnswer: 'opt_9',
    timeTakenSeconds: 34,
    completedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'att_seed_02',
    studentId: 'student-demo-01',
    exerciseId: 'ex-b-mc-01',
    isCorrect: true,
    score: 20,
    maxScore: 20,
    studentAnswer: 'opt_2',
    timeTakenSeconds: 52,
    completedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

/**
 * Fetches exercises filtered by subject and student academic level
 * (not just age — a student's actual academic level at the center).
 */
export async function fetchExercisesForStudent(
  params: FetchExercisesParams
): Promise<Exercise[]> {
  // Simulate network tick
  await new Promise((resolve) => setTimeout(resolve, 10));

  let results = [...CURRICULUM_EXERCISES];

  // 1. Filter by band if specified
  if (params.band) {
    results = results.filter((ex) => ex.targetBand === params.band);
  }

  // 2. Filter by subject if specified
  if (params.subject && params.subject !== 'ALL') {
    const targetSub = params.subject.toUpperCase();
    results = results.filter((ex) => ex.subject.toUpperCase() === targetSub);
  }

  // 3. Filter by student's actual academic level at the center (not just age)
  if (typeof params.studentAcademicLevel === 'number') {
    // Return exercises that fit the student's assessed academic readiness
    // Allows exercises at or up to 1 level above student's current level for challenge
    results = results.filter(
      (ex) => ex.minAcademicLevel <= params.studentAcademicLevel! + 1
    );
  } else if (params.levelCode) {
    results = results.filter((ex) => ex.levelCode === params.levelCode);
  }

  return results;
}

/**
 * Submits an exercise attempt, evaluates correctness, logs attempt into backend,
 * and returns the band-specific feedback payload.
 */
export async function submitExerciseAttempt(
  submission: StudentAttemptSubmission,
  context?: {
    currentStreak?: number;
    currentXp?: number;
    currentAccuracy?: number;
    currentBacReadiness?: number;
  }
): Promise<ExerciseEvaluationResult> {
  // Find exercise
  const exercise = CURRICULUM_EXERCISES.find((e) => e.id === submission.exerciseId);
  if (!exercise) {
    throw new Error(`Exercise not found with id: ${submission.exerciseId}`);
  }

  // Evaluate submission
  const result = evaluateExerciseSubmission(exercise, submission, context);

  // Track attempt in backend storage
  ATTEMPTS_STORE.unshift(result.attemptRecord);

  return result;
}

/**
 * Retrieves all attempts for a given student ID.
 */
export async function getStudentAttempts(
  studentId: string
): Promise<ExerciseAttemptRecord[]> {
  return ATTEMPTS_STORE.filter((att) => att.studentId === studentId);
}

/**
 * Computes live student statistics from tracked attempts.
 */
export async function getStudentAttemptStats(studentId: string): Promise<{
  totalAttempts: number;
  correctAttempts: number;
  accuracyRate: number;
  totalTimeSeconds: number;
  averageTimeSeconds: number;
}> {
  const studentAttempts = ATTEMPTS_STORE.filter((att) => att.studentId === studentId);
  if (studentAttempts.length === 0) {
    return {
      totalAttempts: 0,
      correctAttempts: 0,
      accuracyRate: 100,
      totalTimeSeconds: 0,
      averageTimeSeconds: 0,
    };
  }

  const totalAttempts = studentAttempts.length;
  const correctAttempts = studentAttempts.filter((a) => a.isCorrect).length;
  const accuracyRate = Math.round((correctAttempts / totalAttempts) * 1000) / 10;
  const totalTimeSeconds = studentAttempts.reduce((acc, a) => acc + (a.timeTakenSeconds || 0), 0);
  const averageTimeSeconds = Math.round(totalTimeSeconds / totalAttempts);

  return {
    totalAttempts,
    correctAttempts,
    accuracyRate,
    totalTimeSeconds,
    averageTimeSeconds,
  };
}

/**
 * Returns available academic levels at the center.
 */
export function getAcademicLevels(): AcademicLevel[] {
  return ACADEMIC_LEVELS;
}

// In-memory backend game session repository (persists during application lifecycle)
const GAME_SESSIONS_STORE: GameSessionRecord[] = [];

export interface RecordGameSessionParams {
  studentId: string;
  gameId: string;
  gameType: GameType;
  bandTarget: AgeBand;
  score: number;
  durationSeconds: number;
  totalQuestions: number;
  correctAnswers: number;
  questionAttempts?: {
    exerciseId?: string;
    isCorrect: boolean;
    studentAnswer: string;
    timeTakenSeconds: number;
  }[];
}

/**
 * Records an educational game session, integrates question attempts into the
 * unified exercise attempt telemetry backend (ATTEMPTS_STORE), and calculates rewards.
 */
export async function recordGameSession(
  params: RecordGameSessionParams
): Promise<GameResultSummary> {
  const accuracyPercentage =
    params.totalQuestions > 0
      ? Math.round((params.correctAnswers / params.totalQuestions) * 1000) / 10
      : 100;

  // Calculate rewards scaled to band
  let starsAwarded = 0;
  let xpAwarded = 0;

  if (params.bandTarget === 'BAND_A') {
    // 1 star per correct answer + completion star
    starsAwarded = Math.max(1, params.correctAnswers + 1);
  } else if (params.bandTarget === 'BAND_B') {
    // 25 XP per correct question + speed bonus
    const speedBonus = params.durationSeconds < 60 ? 20 : 10;
    xpAwarded = params.correctAnswers * 25 + speedBonus;
  } else {
    // Band C: Academic precision points
    const precisionMultiplier = accuracyPercentage >= 90 ? 1.5 : 1.0;
    xpAwarded = Math.round((params.correctAnswers * 35 + 25) * precisionMultiplier);
  }

  // 1. Log individual question attempts into ATTEMPTS_STORE so overall stats stay unified
  if (params.questionAttempts && params.questionAttempts.length > 0) {
    for (const qa of params.questionAttempts) {
      ATTEMPTS_STORE.unshift({
        id: `att_game_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        studentId: params.studentId,
        exerciseId: qa.exerciseId || `game_${params.gameId}`,
        isCorrect: qa.isCorrect,
        score: qa.isCorrect ? 10 : 0,
        maxScore: 10,
        studentAnswer: qa.studentAnswer,
        timeTakenSeconds: qa.timeTakenSeconds,
        completedAt: new Date().toISOString(),
      });
    }
  } else {
    // Log overall session as an attempt record
    ATTEMPTS_STORE.unshift({
      id: `att_game_sess_${Date.now()}`,
      studentId: params.studentId,
      exerciseId: `game_${params.gameId}`,
      isCorrect: accuracyPercentage >= 60,
      score: params.score,
      maxScore: params.score,
      studentAnswer: `Score: ${params.score}, Correct: ${params.correctAnswers}/${params.totalQuestions}`,
      timeTakenSeconds: params.durationSeconds,
      completedAt: new Date().toISOString(),
    });
  }

  // 2. Check previous high scores for this student and game
  const prevSessions = GAME_SESSIONS_STORE.filter(
    (s) => s.studentId === params.studentId && s.gameId === params.gameId
  );
  const prevHighScore = prevSessions.reduce((max, s) => Math.max(max, s.score), 0);
  const isNewHighScore = params.score > prevHighScore;
  const currentHighScore = Math.max(prevHighScore, params.score);

  const sessionRecord: GameSessionRecord = {
    id: `gs_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    studentId: params.studentId,
    gameId: params.gameId,
    gameType: params.gameType,
    bandTarget: params.bandTarget,
    score: params.score,
    highScore: currentHighScore,
    isNewHighScore,
    starsAwarded,
    xpAwarded,
    durationSeconds: params.durationSeconds,
    totalQuestions: params.totalQuestions,
    correctAnswers: params.correctAnswers,
    accuracyPercentage,
    playedAt: new Date().toISOString(),
  };

  GAME_SESSIONS_STORE.unshift(sessionRecord);

  // Compute leaderboard placement for Band C / competitive
  const leaderboard = getGameLeaderboard(params.gameId, params.bandTarget, params.score);
  const myRank = leaderboard.find((e) => e.isCurrentStudent)?.rank || 1;

  let feedbackMessage = '';
  if (params.bandTarget === 'BAND_A') {
    feedbackMessage = `Bravo petit explorateur ! Tu as gagné ${starsAwarded} étoiles dorées ! ⭐`;
  } else if (params.bandTarget === 'BAND_B') {
    feedbackMessage = `Victoire Vanguard ! +${xpAwarded} XP enregistrés. Combo de précision validé ! 🔥`;
  } else {
    feedbackMessage = `Épreuve achevée. Précision : ${accuracyPercentage}%. Rang académique : #${myRank}.`;
  }

  return {
    session: sessionRecord,
    starsEarned: starsAwarded,
    xpEarned: xpAwarded,
    leaderboardRank: myRank,
    accuracyRate: accuracyPercentage,
    feedbackMessage,
  };
}

/**
 * Retrieves all game session history for a student.
 */
export async function getStudentGameSessions(
  studentId: string
): Promise<GameSessionRecord[]> {
  return GAME_SESSIONS_STORE.filter((s) => s.studentId === studentId);
}

/**
 * Retrieves global/class leaderboard for a game.
 */
export async function getGameLeaderboardData(
  gameId: string,
  band: AgeBand,
  studentScore?: number,
  studentName?: string
): Promise<LeaderboardEntry[]> {
  return getGameLeaderboard(gameId, band, studentScore, studentName);
}

