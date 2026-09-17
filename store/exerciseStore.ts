import { create } from 'zustand';
import type { AgeBand } from '../theme/types.ts';

export interface ExerciseItem {
  id: string;
  band: AgeBand;
  subject: string; // e.g., 'Math', 'Arabic', 'French', 'Science'
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isCompleted?: boolean;
}

interface ExerciseState {
  exercises: ExerciseItem[];
  selectedSubject: string | null;
  filterByBand: (band: AgeBand) => ExerciseItem[];
  setSubjectFilter: (subject: string | null) => void;
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  selectedSubject: null,
  exercises: [
    // Band A exercises (playful, short, concrete)
    {
      id: 'ea_1',
      band: 'BAND_A',
      subject: 'Math',
      title: 'Counting Solar Stars',
      description: 'Find all matching number stars with Youssef the Fennec!',
      durationMinutes: 4,
      difficulty: 'beginner',
    },
    {
      id: 'ea_2',
      band: 'BAND_A',
      subject: 'Arabic & French',
      title: 'Animal Safari Sounds',
      description: 'Listen and tap the correct animal name in French and Arabic.',
      durationMinutes: 5,
      difficulty: 'beginner',
    },
    // Band B exercises (missions, gamified, structured)
    {
      id: 'eb_1',
      band: 'BAND_B',
      subject: 'Math & Logic',
      title: 'Cyber Fractions Quest',
      description: 'Power the academy airship by balancing algebraic fraction engines.',
      durationMinutes: 12,
      difficulty: 'intermediate',
    },
    {
      id: 'eb_2',
      band: 'BAND_B',
      subject: 'Science',
      title: 'Mediterranean Marine Ecosystems',
      description: 'Classify coastal species of the Gulf of Gabès in interactive 3D cards.',
      durationMinutes: 15,
      difficulty: 'intermediate',
    },
    // Band C exercises (analytical, high school & Baccalaureate prep)
    {
      id: 'ec_1',
      band: 'BAND_C',
      subject: 'Mathematics',
      title: 'Complex Numbers & Polynomials',
      description: 'Tunisian Baccalaureate exam module with step-by-step rigorous proofs.',
      durationMinutes: 30,
      difficulty: 'advanced',
    },
    {
      id: 'ec_2',
      band: 'BAND_C',
      subject: 'Physics',
      title: 'Electromagnetism & RLC Circuits',
      description: 'Interactive resonance simulations and past-exam analytical breakdown.',
      durationMinutes: 35,
      difficulty: 'advanced',
    },
  ],

  filterByBand: (band: AgeBand) => {
    return get().exercises.filter((ex) => ex.band === band);
  },

  setSubjectFilter: (subject) => set({ selectedSubject: subject }),
}));
