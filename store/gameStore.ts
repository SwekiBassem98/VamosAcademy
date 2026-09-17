import { create } from 'zustand';
import type { AgeBand } from '../theme/types.ts';

export interface GameItem {
  id: string;
  band: AgeBand;
  name: string;
  subtitle: string;
  gameType: 'memory_match' | 'speed_trivia' | 'code_logic' | 'bac_blitz';
  highScore: number;
  unlocked: boolean;
  thumbnailEmoji: string;
  subjectTag: string;
}

interface GameState {
  games: GameItem[];
  activeGameId: string | null;
  setActiveGame: (id: string | null) => void;
  updateHighScore: (id: string, score: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  activeGameId: null,
  games: [
    // Band A (Explorers: 6–9) — Simplified, slower, forgiving timing
    {
      id: 'ga_1',
      band: 'BAND_A',
      name: 'Fennec Star Memory Match',
      subtitle: 'Associe les animaux et la nature du désert',
      gameType: 'memory_match',
      highScore: 320,
      unlocked: true,
      thumbnailEmoji: '🦊',
      subjectTag: 'Vocabulaire & Éveil',
    },
    {
      id: 'ga_2',
      band: 'BAND_A',
      name: 'Beat the Clock: Défi des Étoiles',
      subtitle: 'Quiz calme et bienveillant avec Youssef le Fennec',
      gameType: 'speed_trivia',
      highScore: 280,
      unlocked: true,
      thumbnailEmoji: '⭐',
      subjectTag: 'Calcul & Découverte',
    },

    // Band B (Adventurers: 10–13) — High-energy Vanguard speed gauntlet
    {
      id: 'gb_1',
      band: 'BAND_B',
      name: 'Vanguard Speed Trivia',
      subtitle: 'Course contre la montre : fractions, énergie & code',
      gameType: 'speed_trivia',
      highScore: 1450,
      unlocked: true,
      thumbnailEmoji: '⚡',
      subjectTag: 'Math, Science & Python',
    },
    {
      id: 'gb_2',
      band: 'BAND_B',
      name: 'Memory Match : Tech & Sciences',
      subtitle: 'Associe concepts, énergie et algorithmes',
      gameType: 'memory_match',
      highScore: 980,
      unlocked: true,
      thumbnailEmoji: '🤖',
      subjectTag: 'Informatique & Physique',
    },

    // Band C (Scholars: 14–19) — Harder, faster, class & global leaderboard
    {
      id: 'gc_1',
      band: 'BAND_C',
      name: 'Baccalaureate Blitz : Sprint Éclair',
      subtitle: 'Cadence ultra-rapide (8s/q) & classement national Lycées Pilotes',
      gameType: 'bac_blitz',
      highScore: 2840,
      unlocked: true,
      thumbnailEmoji: '🏛️',
      subjectTag: 'Bac Math, Sc & Philo',
    },
    {
      id: 'gc_2',
      band: 'BAND_C',
      name: 'Memory Match : Doctrines & Formules',
      subtitle: 'Appariement rapide auteurs de philo et dérivées d’analyse',
      gameType: 'memory_match',
      highScore: 1650,
      unlocked: true,
      thumbnailEmoji: '📜',
      subjectTag: 'Analyse & Épistémologie',
    },
  ],

  setActiveGame: (id) => set({ activeGameId: id }),

  updateHighScore: (id, score) =>
    set((state) => ({
      games: state.games.map((g) =>
        g.id === id && score > g.highScore ? { ...g, highScore: score } : g
      ),
    })),
}));
