import type { AgeBand } from '../../theme/types.ts';
import type { SubjectCode } from './types.ts';

export type GameType =
  | 'memory_match'
  | 'speed_trivia'
  | 'beat_the_clock'
  | 'bac_blitz';

export interface MemoryCard {
  id: string;
  pairId: string;
  label: string;
  sublabel?: string;
  subject: SubjectCode;
  side: 'left' | 'right';
  isFlipped: boolean;
  isMatched: boolean;
}

export interface TimedQuizQuestion {
  id: string;
  exerciseId: string;
  prompt: string;
  subject: SubjectCode;
  subjectName: string;
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
  }[];
  correctOptionId: string;
  explanation: string;
  points: number;
  xpAwarded: number;
  starsAwarded: number;
  timeLimitSeconds: number; // Forgiving for Band A (30s), standard for Band B (15s), fast/hard for Band C (8-10s)
  hint?: string;
}

export interface GameSessionRecord {
  id: string;
  studentId: string;
  gameId: string;
  gameType: GameType;
  bandTarget: AgeBand;
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  starsAwarded: number;
  xpAwarded: number;
  durationSeconds: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracyPercentage: number;
  playedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  studentName: string;
  schoolOrCity: string;
  score: number;
  accuracy: number;
  timeSeconds: number;
  isCurrentStudent: boolean;
}

export interface GameResultSummary {
  session: GameSessionRecord;
  starsEarned: number;
  xpEarned: number;
  leaderboardRank?: number;
  accuracyRate: number;
  feedbackMessage: string;
}
