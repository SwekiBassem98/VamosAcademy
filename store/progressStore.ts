import { create } from 'zustand';
import type { AgeBand } from '../theme/types.ts';

export interface ProgressMetric {
  stars: number; // For Band A (Explorers)
  xp: number; // For Band B (Adventurers)
  currentLevel: number; // For Band B
  streakDays: number; // All bands
  accuracyRate: number; // For Band C (Scholars)
  completedExercisesCount: number;
  bacReadinessScore?: number; // Band C only
}

export interface StickerItem {
  id: string;
  name: string;
  emoji: string;
  starsRequired: number;
}

export const STICKER_CATALOG: StickerItem[] = [
  { id: 'fennec', name: 'Youssef Fennec', emoji: '🦊', starsRequired: 5 },
  { id: 'wand', name: 'Star Wand', emoji: '🪄', starsRequired: 10 },
  { id: 'palm', name: 'Oasis Palm', emoji: '🌴', starsRequired: 15 },
  { id: 'camel', name: 'Sahara Camel', emoji: '🐪', starsRequired: 20 },
  { id: 'rocket', name: 'Star Rocket', emoji: '🚀', starsRequired: 30 },
  { id: 'crown', name: 'Royal Crown', emoji: '👑', starsRequired: 45 },
];

interface ProgressState {
  metrics: ProgressMetric;
  completedExerciseIds: string[];
  recentCelebration: { timestamp: number; message: string } | null;
  
  // Actions
  addStars: (count: number) => void;
  triggerCelebration: (message?: string) => void;
  clearCelebration: () => void;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
  markExerciseComplete: (id: string, scorePercentage: number) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  metrics: {
    stars: 24,
    xp: 680,
    currentLevel: 4,
    streakDays: 5,
    accuracyRate: 91.5,
    completedExercisesCount: 18,
    bacReadinessScore: 84,
  },
  completedExerciseIds: ['ex_math_01', 'ex_french_02'],
  recentCelebration: null,

  addStars: (count) =>
    set((state) => ({
      metrics: { ...state.metrics, stars: state.metrics.stars + count },
      recentCelebration: { timestamp: Date.now(), message: `+${count} Stars!` },
    })),

  triggerCelebration: (message = 'Superstar! Quest Completed!') =>
    set({
      recentCelebration: { timestamp: Date.now(), message },
    }),

  clearCelebration: () =>
    set({
      recentCelebration: null,
    }),

  addXp: (amount) =>
    set((state) => {
      const newXp = state.metrics.xp + amount;
      const newLevel = Math.floor(newXp / 250) + 1;
      return {
        metrics: {
          ...state.metrics,
          xp: newXp,
          currentLevel: newLevel,
        },
      };
    }),

  incrementStreak: () =>
    set((state) => ({
      metrics: { ...state.metrics, streakDays: state.metrics.streakDays + 1 },
    })),

  markExerciseComplete: (id, scorePercentage) =>
    set((state) => {
      const ids = state.completedExerciseIds.includes(id)
        ? state.completedExerciseIds
        : [...state.completedExerciseIds, id];
      const count = ids.length;
      return {
        completedExerciseIds: ids,
        metrics: {
          ...state.metrics,
          completedExercisesCount: count,
          stars: state.metrics.stars + 3,
          xp: state.metrics.xp + 50,
        },
      };
    }),

  resetProgress: () =>
    set({
      metrics: {
        stars: 0,
        xp: 0,
        currentLevel: 1,
        streakDays: 0,
        accuracyRate: 0,
        completedExercisesCount: 0,
        bacReadinessScore: 0,
      },
      completedExerciseIds: [],
    }),
}));
