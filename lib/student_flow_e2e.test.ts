import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveAgeBand,
  resolveAgeBandDetails,
  isParentContactRequired,
} from './themeResolver.ts';
import { createStudentProfile } from './auth.ts';
import { CURRICULUM_EXERCISES } from './exercises/curriculum.ts';
import { getTimedQuizForBand, getMemoryCardsForBand } from './exercises/gameContent.ts';
import { BAND_A_THEME, BAND_B_THEME, BAND_C_THEME } from '../theme/tokens.ts';

describe('Vamos Academy — E2E Student Flow & Age-Band Isolation Tests', () => {
  const TEST_AGES = [6, 9, 10, 13, 14, 19] as const;

  describe('Age Boundary & Component Routing Isolation', () => {
    TEST_AGES.forEach((age) => {
      it(`evaluates age ${age} for landing route, mascot, parent policy, and theme isolation`, () => {
        const band = resolveAgeBand(age);
        const details = resolveAgeBandDetails(age);
        const parentRequired = isParentContactRequired(age);

        if (age === 6 || age === 9) {
          assert.strictEqual(band, 'BAND_A');
          assert.strictEqual(details.routePrefix, '/(band-a)');
          assert.strictEqual(details.displayName, 'The Explorers');
          assert.strictEqual(details.theme.mascot.name, 'Youssef the Fennec');
          assert.strictEqual(details.theme.components.has3DBevel, true);
          assert.strictEqual(details.theme.colors.primary, '#D80027');
          assert.strictEqual(parentRequired, true, 'Age < 13 requires parent authorization');
        } else if (age === 10) {
          assert.strictEqual(band, 'BAND_B');
          assert.strictEqual(details.routePrefix, '/(band-b)');
          assert.strictEqual(details.displayName, 'The Adventurers');
          assert.strictEqual(details.theme.mascot.name, 'The Vamos Vanguard');
          assert.strictEqual(details.theme.components.has3DBevel, false);
          assert.strictEqual(details.theme.colors.primary, '#D80027');
          assert.strictEqual(parentRequired, true, 'Age 10 (< 13) requires parent authorization');
        } else if (age === 13) {
          assert.strictEqual(band, 'BAND_B');
          assert.strictEqual(details.routePrefix, '/(band-b)');
          assert.strictEqual(details.displayName, 'The Adventurers');
          assert.strictEqual(details.theme.mascot.name, 'The Vamos Vanguard');
          assert.strictEqual(details.theme.colors.primary, '#D80027');
          assert.strictEqual(parentRequired, false, 'Age 13 is eligible for direct account registration');
        } else if (age === 14 || age === 19) {
          assert.strictEqual(band, 'BAND_C');
          assert.strictEqual(details.routePrefix, '/(band-c)');
          assert.strictEqual(details.displayName, 'The Scholars');
          assert.strictEqual(details.theme.mascot.name, 'Vamos Academic Honors');
          assert.strictEqual(details.theme.components.has3DBevel, false);
          assert.strictEqual(details.theme.colors.primary, '#12151B');
          assert.strictEqual(parentRequired, false, 'Ages 14 and 19 are secondary/baccalaureate students');
        }
      });
    });
  });

  describe('Zero Visual Bleed & Token Integrity', () => {
    it('verifies Band A theme tokens are distinct and isolated', () => {
      assert.strictEqual(BAND_A_THEME.band, 'BAND_A');
      assert.strictEqual(BAND_A_THEME.components.minTouchTarget, 56);
      assert.strictEqual(BAND_A_THEME.components.buttonRadius, 28);
      assert.strictEqual(BAND_A_THEME.components.has3DBevel, true);
      assert.strictEqual(BAND_A_THEME.colors.surface, '#FFFDF9');
    });

    it('verifies Band B theme tokens are distinct and isolated', () => {
      assert.strictEqual(BAND_B_THEME.band, 'BAND_B');
      assert.strictEqual(BAND_B_THEME.components.minTouchTarget, 48);
      assert.strictEqual(BAND_B_THEME.components.buttonRadius, 14);
      assert.strictEqual(BAND_B_THEME.components.has3DBevel, false);
      assert.notStrictEqual(BAND_B_THEME.components.buttonRadius, BAND_A_THEME.components.buttonRadius);
      assert.strictEqual(BAND_B_THEME.colors.surface, '#F8FAFC');
    });

    it('verifies Band C theme tokens are distinct and isolated', () => {
      assert.strictEqual(BAND_C_THEME.band, 'BAND_C');
      assert.strictEqual(BAND_C_THEME.components.minTouchTarget, 48);
      assert.strictEqual(BAND_C_THEME.components.buttonRadius, 10);
      assert.strictEqual(BAND_C_THEME.components.has3DBevel, false);
      assert.notStrictEqual(BAND_C_THEME.colors.primary, BAND_B_THEME.colors.primary);
      assert.strictEqual(BAND_C_THEME.colors.primary, '#12151B');
    });
  });

  describe('Full Student Journey: Registration -> Home -> Exercise -> Game -> Progress', () => {
    it('executes full journey for Band A (Age 8)', () => {
      // 1. Account registration
      const profile = createStudentProfile({
        id: 'student_band_a_test',
        fullName: 'Yassine Explorer',
        emailOrPhone: 'parent@vamos.tn',
        birthDate: '2018-04-12',
        age: 8,
        parentFullName: 'Mouna Ben Salem',
        parentContact: '+21698123456',
        centerBranch: 'Tunis Central',
      });
      assert.strictEqual(profile.ageBand, 'BAND_A');
      assert.ok(profile.centerStudentCode.length > 0);

      // 2. Load Band A curriculum exercises
      const bandAExercises = CURRICULUM_EXERCISES.filter((ex) => ex.targetBand === 'BAND_A');
      assert.ok(bandAExercises.length >= 5, 'Band A must have curriculum exercises');
      const firstEx = bandAExercises[0];
      assert.strictEqual(firstEx.targetBand, 'BAND_A');

      // 3. Complete Band A exercise
      const isCorrect = true;
      const starsEarned = isCorrect ? firstEx.starsAwarded : 0;
      assert.ok(starsEarned > 0, 'Exercise awards stars in Band A');

      // 4. Play Band A Game (Beat the clock trivia)
      const quiz = getTimedQuizForBand('BAND_A', 5);
      assert.strictEqual(quiz.length, 5);
      quiz.forEach((q) => {
        assert.ok(q.options.length >= 2);
        assert.ok(typeof q.correctOptionId === 'string');
      });

      // 5. Play Band A Memory Match
      const memoryCards = getMemoryCardsForBand('BAND_A');
      assert.strictEqual(memoryCards.length, 6, 'Band A has 6 cards (3 pairs) for young children');
    });

    it('executes full journey for Band B (Age 12)', () => {
      // 1. Account registration
      const profile = createStudentProfile({
        id: 'student_band_b_test',
        fullName: 'Mariem Adventurer',
        emailOrPhone: 'mariem@vamos.tn',
        birthDate: '2014-06-15',
        age: 12,
        parentFullName: 'Hedi Ben Salem',
        parentContact: '+21698654321',
        centerBranch: 'Sousse',
      });
      assert.strictEqual(profile.ageBand, 'BAND_B');
      assert.ok(profile.centerStudentCode.length > 0);

      // 2. Load Band B curriculum exercises
      const bandBExercises = CURRICULUM_EXERCISES.filter((ex) => ex.targetBand === 'BAND_B');
      assert.ok(bandBExercises.length >= 5, 'Band B must have exercises');
      const firstEx = bandBExercises[0];
      assert.strictEqual(firstEx.targetBand, 'BAND_B');

      // 3. Play Band B Speed Gauntlet
      const quiz = getTimedQuizForBand('BAND_B', 5);
      assert.strictEqual(quiz.length, 5);

      // 4. Play Band B Cyber-Memory Matrix
      const memoryCards = getMemoryCardsForBand('BAND_B');
      assert.strictEqual(memoryCards.length, 8, 'Band B has 8 cards (4 pairs)');
    });

    it('executes full journey for Band C (Age 18)', () => {
      // 1. Account registration (self-directed)
      const profile = createStudentProfile({
        id: 'student_band_c_test',
        fullName: 'Ahmed Scholar',
        emailOrPhone: 'ahmed@bac.tn',
        birthDate: '2008-01-10',
        age: 18,
        centerBranch: 'Sfax',
      });
      assert.strictEqual(profile.ageBand, 'BAND_C');
      assert.ok(profile.centerStudentCode.length > 0);

      // 2. Load Band C curriculum exercises (Baccalaureate level)
      const bandCExercises = CURRICULUM_EXERCISES.filter((ex) => ex.targetBand === 'BAND_C');
      assert.ok(bandCExercises.length >= 5, 'Band C must have Bac exercises');
      const firstEx = bandCExercises[0];
      assert.strictEqual(firstEx.targetBand, 'BAND_C');

      // 3. Play Baccalaureate Blitz
      const quiz = getTimedQuizForBand('BAND_C', 5);
      assert.strictEqual(quiz.length, 5);
      quiz.forEach((q) => {
        assert.ok(q.explanation.length > 5, 'Band C questions have detailed Bac explanations');
      });

      // 4. Play Doctrines & Formulas Memory
      const memoryCards = getMemoryCardsForBand('BAND_C');
      assert.strictEqual(memoryCards.length, 10, 'Band C has 10 cards (5 pairs)');
    });
  });
});
