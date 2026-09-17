import test, { describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  getMemoryCardsForBand,
  getTimedQuizForBand,
  getGameLeaderboard,
  recordGameSession,
  getStudentGameSessions,
} from './exercises/index.ts';

describe('Vamos Academy — Educational Games & Curriculum Engine Integration Tests', () => {
  describe('Memory Matching Game Generator', () => {
    test('generates cards correctly for Band A (3 pairs = 6 cards)', () => {
      const cards = getMemoryCardsForBand('BAND_A');
      assert.equal(cards.length, 6, 'Band A should generate 6 cards (3 pairs)');
      const pairIds = new Set(cards.map((c) => c.pairId));
      assert.equal(pairIds.size, 3, 'There should be exactly 3 unique pairIds');
      // Every card starts face down and unmatched
      cards.forEach((card) => {
        assert.equal(card.isFlipped, false);
        assert.equal(card.isMatched, false);
        assert.ok(card.label.length > 0);
      });
    });

    test('generates cards correctly for Band B (4 pairs = 8 cards)', () => {
      const cards = getMemoryCardsForBand('BAND_B');
      assert.equal(cards.length, 8, 'Band B should generate 8 cards (4 pairs)');
      const pairIds = new Set(cards.map((c) => c.pairId));
      assert.equal(pairIds.size, 4);
    });

    test('generates cards correctly for Band C (5 pairs = 10 cards)', () => {
      const cards = getMemoryCardsForBand('BAND_C');
      assert.equal(cards.length, 10, 'Band C should generate 10 cards (5 pairs)');
      const pairIds = new Set(cards.map((c) => c.pairId));
      assert.equal(pairIds.size, 5);
    });

    test('supports custom pair count override', () => {
      const cards = getMemoryCardsForBand('BAND_A', 2);
      assert.equal(cards.length, 4, 'Custom pair count of 2 yields 4 cards');
    });
  });

  describe('Timed Quiz ("Beat the Clock" & "Bac Blitz") Generator', () => {
    test('generates Band A quiz with generous 30s timer and hints', () => {
      const quiz = getTimedQuizForBand('BAND_A', 3);
      assert.equal(quiz.length, 3);
      quiz.forEach((q) => {
        assert.equal(q.timeLimitSeconds, 30, 'Band A time limit must be 30s');
        assert.ok(q.options.length >= 2, 'Options must be present');
        assert.ok(q.correctOptionId, 'Correct option must be defined');
        assert.ok(q.hint, 'Hint should be provided for Band A');
      });
    });

    test('generates Band B quiz with 15s speed gauntlet timer', () => {
      const quiz = getTimedQuizForBand('BAND_B', 4);
      assert.equal(quiz.length, 4);
      quiz.forEach((q) => {
        assert.equal(q.timeLimitSeconds, 15, 'Band B time limit must be 15s');
      });
    });

    test('generates Band C quiz with ultra-fast 8s Baccalaureate blitz timer', () => {
      const quiz = getTimedQuizForBand('BAND_C', 5);
      assert.equal(quiz.length, 5);
      quiz.forEach((q) => {
        assert.equal(q.timeLimitSeconds, 8, 'Band C time limit must be 8s');
      });
    });
  });

  describe('Game Session Recording & Telemetry Unification', () => {
    test('records Band A game session with stars awarded', async () => {
      const result = await recordGameSession({
        studentId: 'test_student_a',
        gameId: 'ga_1',
        gameType: 'memory_match',
        bandTarget: 'BAND_A',
        score: 450,
        durationSeconds: 42,
        totalQuestions: 3,
        correctAnswers: 3,
      });

      assert.ok(result.session.id.startsWith('gs_'));
      assert.equal(result.starsEarned, 4); // 3 correct + 1 bonus
      assert.equal(result.accuracyRate, 100);
      assert.match(result.feedbackMessage, /étoiles dorées/);

      const sessions = await getStudentGameSessions('test_student_a');
      assert.ok(sessions.length >= 1);
      assert.equal(sessions[0].gameId, 'ga_1');
    });

    test('records Band B game session with Vanguard XP awarded', async () => {
      const result = await recordGameSession({
        studentId: 'test_student_b',
        gameId: 'gb_1',
        gameType: 'speed_trivia',
        bandTarget: 'BAND_B',
        score: 1200,
        durationSeconds: 50,
        totalQuestions: 5,
        correctAnswers: 4,
      });

      assert.ok(result.xpEarned > 0, 'XP must be awarded for Band B');
      assert.equal(result.accuracyRate, 80);
      assert.match(result.feedbackMessage, /Vanguard/);
    });

    test('records Band C game session with Bac academic precision scoring and ranking', async () => {
      const result = await recordGameSession({
        studentId: 'test_scholar_c',
        gameId: 'gc_1',
        gameType: 'bac_blitz',
        bandTarget: 'BAND_C',
        score: 3200,
        durationSeconds: 38,
        totalQuestions: 5,
        correctAnswers: 5,
      });

      assert.equal(result.accuracyRate, 100);
      assert.ok(result.leaderboardRank <= 3, 'High score should place student at top rank');
      assert.match(result.feedbackMessage, /Épreuve achevée/);
    });
  });

  describe('Leaderboard Generator', () => {
    test('generates ranked leaderboard containing current student', () => {
      const board = getGameLeaderboard('gc_1', 'BAND_C', 3500, 'Nour Al-Khatib');
      assert.ok(board.length >= 6);

      // Verify sorted by score descending
      for (let i = 0; i < board.length - 1; i++) {
        assert.ok(board[i].score >= board[i + 1].score);
        assert.equal(board[i].rank, i + 1);
      }

      const currentStudent = board.find((e) => e.isCurrentStudent);
      assert.ok(currentStudent);
      assert.equal(currentStudent.studentName, 'Nour Al-Khatib');
      assert.equal(currentStudent.score, 3500);
      assert.equal(currentStudent.rank, 1, 'Top score of 3500 should be rank #1');
    });
  });
});
