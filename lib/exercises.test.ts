import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateMultipleChoice,
  evaluateFillInTheBlank,
  evaluateMatchingPairs,
  evaluateShortAnswer,
  evaluateExerciseSubmission,
  generateBandFeedback,
  normalizeAnswer,
} from './exercises/evaluator.ts';
import {
  fetchExercisesForStudent,
  submitExerciseAttempt,
  getStudentAttempts,
  getStudentAttemptStats,
  getAcademicLevels,
} from './exercises/api.ts';
import type {
  MultipleChoiceExercise,
  FillInTheBlankExercise,
  MatchingPairsExercise,
  ShortAnswerExercise,
} from './exercises/types.ts';

describe('Vamos Academy — Shared Exercises Engine Unit Tests', () => {
  describe('normalizeAnswer utility', () => {
    it('trims leading/trailing whitespace, folds case, collapses multiple spaces', () => {
      assert.strictEqual(normalizeAnswer('   Youssef   Fennec  '), 'youssef fennec');
      assert.strictEqual(normalizeAnswer('ALGORITHME'), 'algorithme');
      assert.strictEqual(normalizeAnswer(''), '');
    });
  });

  describe('Core Exercise Type 1: Multiple Choice', () => {
    const mcExercise: MultipleChoiceExercise = {
      id: 'test-mc-1',
      subject: 'MATH',
      subjectName: 'Math',
      title: 'Fraction Question',
      prompt: 'What is 18/24 in lowest terms?',
      targetBand: 'BAND_B',
      minAcademicLevel: 3,
      levelCode: 'LVL-3',
      exerciseType: 'multiple_choice',
      points: 20,
      xpAwarded: 75,
      starsAwarded: 3,
      estimatedDurationSeconds: 90,
      explanation: '18/24 simplifies to 3/4 by dividing by 6.',
      options: [
        { id: 'opt_1', label: '2/3', isCorrect: false },
        { id: 'opt_2', label: '3/4', isCorrect: true },
        { id: 'opt_3', label: '1/2', isCorrect: false },
      ],
    };

    it('awards full score when the correct option is chosen', () => {
      const res = evaluateMultipleChoice(mcExercise, 'opt_2');
      assert.strictEqual(res.isCorrect, true);
      assert.strictEqual(res.score, 20);
      assert.strictEqual(res.maxScore, 20);
    });

    it('awards 0 score when an incorrect option is chosen', () => {
      const res = evaluateMultipleChoice(mcExercise, 'opt_1');
      assert.strictEqual(res.isCorrect, false);
      assert.strictEqual(res.score, 0);
    });

    it('evaluates multi-selection arrays accurately', () => {
      const res = evaluateMultipleChoice(mcExercise, ['opt_2']);
      assert.strictEqual(res.isCorrect, true);

      const resWrong = evaluateMultipleChoice(mcExercise, ['opt_1', 'opt_2']);
      assert.strictEqual(resWrong.isCorrect, false);
    });
  });

  describe('Core Exercise Type 2: Fill in the Blank', () => {
    const fitbExercise: FillInTheBlankExercise = {
      id: 'test-fitb-1',
      subject: 'FRENCH',
      subjectName: 'French',
      title: 'Grammar',
      prompt: 'Fill in the blanks',
      targetBand: 'BAND_A',
      minAcademicLevel: 1,
      levelCode: 'LVL-1',
      exerciseType: 'fill_in_the_blank',
      template: 'Le fennec vit dans le {blank} et possède de grandes {blank}.',
      points: 20,
      xpAwarded: 50,
      starsAwarded: 3,
      estimatedDurationSeconds: 60,
      explanation: 'Le fennec vit dans le désert avec de grandes oreilles.',
      blanks: [
        {
          id: 'b1',
          acceptedAnswers: ['désert', 'desert', 'sahara'],
        },
        {
          id: 'b2',
          acceptedAnswers: ['oreilles', 'oreil'],
        },
      ],
    };

    it('evaluates perfect match with case-insensitivity and trimming', () => {
      const res = evaluateFillInTheBlank(fitbExercise, {
        b1: '  DESERT  ',
        b2: 'Oreilles',
      });
      assert.strictEqual(res.isCorrect, true);
      assert.strictEqual(res.score, 20);
      assert.strictEqual(res.correctBlanksCount, 2);
    });

    it('evaluates partial score when only one blank is correct', () => {
      const res = evaluateFillInTheBlank(fitbExercise, {
        b1: 'désert',
        b2: 'pattes',
      });
      assert.strictEqual(res.isCorrect, false);
      assert.strictEqual(res.score, 10);
      assert.strictEqual(res.correctBlanksCount, 1);
    });
  });

  describe('Core Exercise Type 3: Matching Pairs', () => {
    const matchingExercise: MatchingPairsExercise = {
      id: 'test-match-1',
      subject: 'SCIENCE',
      subjectName: 'Science',
      title: 'Habitat Matching',
      prompt: 'Match animal to habitat',
      targetBand: 'BAND_A',
      minAcademicLevel: 2,
      levelCode: 'LVL-2',
      exerciseType: 'matching_pairs',
      points: 20,
      xpAwarded: 50,
      starsAwarded: 4,
      estimatedDurationSeconds: 90,
      explanation: 'Fennec in Sahara, Dolphin in Sea.',
      pairs: [
        { id: 'p1', left: 'Fennec', right: 'Sahara' },
        { id: 'p2', left: 'Dolphin', right: 'Mediterranean Sea' },
      ],
    };

    it('validates correctly matched pairs', () => {
      const res = evaluateMatchingPairs(matchingExercise, {
        p1: 'Sahara',
        p2: 'Mediterranean Sea',
      });
      assert.strictEqual(res.isCorrect, true);
      assert.strictEqual(res.score, 20);
      assert.strictEqual(res.matchedPairsCount, 2);
    });

    it('detects mismatched pairs and calculates proportional score', () => {
      const res = evaluateMatchingPairs(matchingExercise, {
        p1: 'Sahara',
        p2: 'Forest',
      });
      assert.strictEqual(res.isCorrect, false);
      assert.strictEqual(res.score, 10);
      assert.strictEqual(res.matchedPairsCount, 1);
    });
  });

  describe('Core Exercise Type 4: Short Free-Text Answer', () => {
    const saExercise: ShortAnswerExercise = {
      id: 'test-sa-1',
      subject: 'MATH',
      subjectName: 'Math',
      title: 'Linear Equation',
      prompt: 'Solve 3x - 7 = 14. What is x?',
      targetBand: 'BAND_B',
      minAcademicLevel: 4,
      levelCode: 'LVL-4',
      exerciseType: 'short_answer',
      points: 20,
      xpAwarded: 70,
      starsAwarded: 3,
      estimatedDurationSeconds: 60,
      explanation: '3x = 21, hence x = 7.',
      acceptedAnswers: ['7', 'x=7', 'x = 7'],
      numericTolerance: 0,
    };

    it('accepts numerical and formulaic variations of the correct solution', () => {
      assert.strictEqual(evaluateShortAnswer(saExercise, '7').isCorrect, true);
      assert.strictEqual(evaluateShortAnswer(saExercise, 'x=7').isCorrect, true);
      assert.strictEqual(evaluateShortAnswer(saExercise, '  7.0  ').isCorrect, true);
    });

    it('rejects incorrect numerical solutions', () => {
      const res = evaluateShortAnswer(saExercise, '8');
      assert.strictEqual(res.isCorrect, false);
      assert.strictEqual(res.score, 0);
    });
  });

  describe('Band-Specific Presentation Feedback Engine', () => {
    const exerciseA: MultipleChoiceExercise = {
      id: 'ex-a-test',
      subject: 'MATH',
      subjectName: 'Math',
      title: 'Stars',
      prompt: 'Prompt',
      targetBand: 'BAND_A',
      minAcademicLevel: 1,
      levelCode: 'LVL-1',
      exerciseType: 'multiple_choice',
      points: 10,
      xpAwarded: 40,
      starsAwarded: 3,
      estimatedDurationSeconds: 30,
      explanation: '4 + 5 = 9.',
      options: [{ id: 'opt_1', label: '9', isCorrect: true }],
    };

    const exerciseB: MultipleChoiceExercise = {
      ...exerciseA,
      id: 'ex-b-test',
      targetBand: 'BAND_B',
      xpAwarded: 75,
    };

    const exerciseC: MultipleChoiceExercise = {
      ...exerciseA,
      id: 'ex-c-test',
      targetBand: 'BAND_C',
      points: 25,
    };

    it('Band A: produces cheerful animation cues, mascot reaction, and audio feedback', () => {
      const feedback = generateBandFeedback(exerciseA, true, 20);
      assert.strictEqual(feedback.band, 'BAND_A');
      assert.ok(feedback.bandA);
      assert.strictEqual(feedback.bandA?.starsEarned, 3);
      assert.strictEqual(feedback.bandA?.mascotReaction, 'celebrate');
      assert.strictEqual(feedback.bandA?.soundCue, 'fanfare_cheerful');
      assert.match(feedback.bandA?.cheerTitle || '', /BRAVO|CHAMPION/);
    });

    it('Band B: produces XP gained, streak days update, and level progress', () => {
      const feedback = generateBandFeedback(exerciseB, true, 45, { currentStreak: 5, currentXp: 480 });
      assert.strictEqual(feedback.band, 'BAND_B');
      assert.ok(feedback.bandB);
      assert.strictEqual(feedback.bandB?.xpGained, 75);
      assert.strictEqual(feedback.bandB?.streakDays, 6);
      assert.strictEqual(feedback.bandB?.streakIncremented, true);
      assert.ok(feedback.bandB?.level >= 3);
    });

    it('Band C: produces accuracy stat updated, minimal animation, and Baccalaureate rubric', () => {
      const feedback = generateBandFeedback(exerciseC, true, 80, { currentAccuracy: 92.0, currentBacReadiness: 84.0 });
      assert.strictEqual(feedback.band, 'BAND_C');
      assert.ok(feedback.bandC);
      assert.strictEqual(feedback.bandC?.accuracyDelta, 0.8);
      assert.strictEqual(feedback.bandC?.accuracyPercent, 92.8);
      assert.strictEqual(feedback.bandC?.bacReadinessScore, 84.5);
      assert.match(feedback.bandC?.markingRubric || '', /Barème Officiel Bac Tunisien/);
    });
  });

  describe('Curriculum & Academic Level Filtering', () => {
    it('fetches academic levels and verifies progression tiers', () => {
      const levels = getAcademicLevels();
      assert.ok(levels.length >= 6);
      assert.strictEqual(levels[0].code, 'LVL-1-DISCOVERY');
      assert.strictEqual(levels[0].band, 'BAND_A');
      assert.strictEqual(levels.find((l) => l.code === 'LVL-6-BAC-PREP')?.band, 'BAND_C');
    });

    it('filters exercises by student academic level (not just age)', async () => {
      // Student at level 2 should only receive exercises with minAcademicLevel <= 3
      const exLevel2 = await fetchExercisesForStudent({
        studentAcademicLevel: 2,
      });
      assert.ok(exLevel2.length > 0);
      assert.ok(exLevel2.every((ex) => ex.minAcademicLevel <= 3));

      // Filter by subject
      const mathEx = await fetchExercisesForStudent({
        subject: 'MATH',
      });
      assert.ok(mathEx.every((ex) => ex.subject === 'MATH'));
    });
  });

  describe('Attempt Tracking & Telemetry', () => {
    it('submits attempt and tracks in backend with studentId and time taken', async () => {
      const studentId = 'test-scholar-99';
      const submission = {
        studentId,
        exerciseId: 'ex-c-mc-01',
        studentAnswer: 'opt_2',
        timeTakenSeconds: 42,
      };

      const result = await submitExerciseAttempt(submission, {
        currentAccuracy: 94.0,
      });

      assert.strictEqual(result.isCorrect, true);
      assert.strictEqual(result.attemptRecord.studentId, studentId);
      assert.strictEqual(result.attemptRecord.timeTakenSeconds, 42);

      // Verify stored attempts
      const attempts = await getStudentAttempts(studentId);
      assert.ok(attempts.length >= 1);
      assert.strictEqual(attempts[0].exerciseId, 'ex-c-mc-01');

      // Verify attempt stats
      const stats = await getStudentAttemptStats(studentId);
      assert.strictEqual(stats.totalAttempts >= 1, true);
      assert.strictEqual(stats.correctAttempts >= 1, true);
      assert.strictEqual(stats.accuracyRate, 100);
    });
  });
});
