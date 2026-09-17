import type { AgeBand } from '../../theme/types.ts';

export type ExerciseType =
  | 'multiple_choice'
  | 'fill_in_the_blank'
  | 'matching_pairs'
  | 'short_answer';

export type SubjectCode =
  | 'MATH'
  | 'SCIENCE'
  | 'ARABIC'
  | 'FRENCH'
  | 'INFORMATIQUE'
  | 'PHILOSOPHY';

export interface AcademicLevel {
  code: string;
  levelNumber: number; // 1 to 10
  displayName: string;
  gradeEquivalent: string;
  band: AgeBand;
  description: string;
}

export interface MultipleChoiceOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface BlankSlot {
  id: string;
  acceptedAnswers: string[];
  placeholder?: string;
  caseSensitive?: boolean;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface BaseExercise {
  id: string;
  subject: SubjectCode;
  subjectName: string;
  title: string;
  prompt: string;
  targetBand: AgeBand;
  minAcademicLevel: number; // Student's assessed center level (1-10)
  levelCode: string; // e.g. "MATH-LVL-1"
  exerciseType: ExerciseType;
  explanation: string; // Pedagogical explanation shown in results
  points: number;
  xpAwarded: number;
  starsAwarded: number;
  estimatedDurationSeconds: number;
  hints?: string[];
}

export interface MultipleChoiceExercise extends BaseExercise {
  exerciseType: 'multiple_choice';
  options: MultipleChoiceOption[];
  allowMultiple?: boolean;
}

export interface FillInTheBlankExercise extends BaseExercise {
  exerciseType: 'fill_in_the_blank';
  template: string; // e.g. "7 x 8 = {blank} et un polygone à 5 côtés est un {blank}."
  blanks: BlankSlot[];
}

export interface MatchingPairsExercise extends BaseExercise {
  exerciseType: 'matching_pairs';
  pairs: MatchingPair[];
}

export interface ShortAnswerExercise extends BaseExercise {
  exerciseType: 'short_answer';
  acceptedAnswers: string[];
  sampleAnswer?: string;
  rubricKeywords?: string[];
  caseSensitive?: boolean;
  numericTolerance?: number;
}

export type Exercise =
  | MultipleChoiceExercise
  | FillInTheBlankExercise
  | MatchingPairsExercise
  | ShortAnswerExercise;

export interface StudentAttemptSubmission {
  studentId: string;
  exerciseId: string;
  studentAnswer: string | string[] | Record<string, string>;
  timeTakenSeconds: number;
}

export interface ExerciseAttemptRecord {
  id: string;
  studentId: string;
  exerciseId: string;
  isCorrect: boolean;
  score: number;
  maxScore: number;
  studentAnswer: string;
  timeTakenSeconds: number;
  completedAt: string;
}

export interface BandFeedbackPayload {
  band: AgeBand;
  // Band A: Big cheerful animation + audio reaction
  bandA?: {
    starsEarned: number;
    cheerTitle: string;
    cheerMessage: string;
    mascotReaction: 'celebrate' | 'encourage';
    soundCue: 'fanfare_cheerful' | 'soft_boing';
    badgeEarned?: string;
  };
  // Band B: XP gained + streak update + mission status
  bandB?: {
    xpGained: number;
    streakDays: number;
    streakIncremented: boolean;
    level: number;
    xpProgressPercent: number;
    missionComplete: boolean;
  };
  // Band C: Accuracy stat updated, minimal sober animation, official Bac rubric
  bandC?: {
    accuracyPercent: number;
    accuracyDelta: number; // e.g. +1.4%
    bacReadinessScore: number;
    timeTakenSeconds: number;
    markingRubric: string;
  };
}

export interface ExerciseEvaluationResult {
  isCorrect: boolean;
  score: number;
  maxScore: number;
  accuracyPercentage: number;
  explanation: string;
  detailedFeedback: string;
  feedbackPayload: BandFeedbackPayload;
  attemptRecord: ExerciseAttemptRecord;
}
