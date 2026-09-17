import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveAgeBand,
  resolveAgeBandSafe,
  resolveAgeBandDetails,
  isValidStudentAge,
  MIN_STUDENT_AGE,
  MAX_STUDENT_AGE,
  calculateAgeFromBirthDate,
  isParentContactRequired,
  checkAgeBandTransition,
} from './themeResolver.ts';

describe('Vamos Academy — themeResolver Core Unit Tests', () => {
  describe('Exact prompt-required age tests (6, 9, 10, 13, 14, 19)', () => {
    it('resolves age 6 to BAND_A (The Explorers lower boundary)', () => {
      assert.strictEqual(resolveAgeBand(6), 'BAND_A');
    });

    it('resolves age 9 to BAND_A (The Explorers upper boundary)', () => {
      assert.strictEqual(resolveAgeBand(9), 'BAND_A');
    });

    it('resolves age 10 to BAND_B (The Adventurers lower boundary)', () => {
      assert.strictEqual(resolveAgeBand(10), 'BAND_B');
    });

    it('resolves age 13 to BAND_B (The Adventurers upper boundary)', () => {
      assert.strictEqual(resolveAgeBand(13), 'BAND_B');
    });

    it('resolves age 14 to BAND_C (The Scholars lower boundary)', () => {
      assert.strictEqual(resolveAgeBand(14), 'BAND_C');
    });

    it('resolves age 19 to BAND_C (The Scholars upper boundary)', () => {
      assert.strictEqual(resolveAgeBand(19), 'BAND_C');
    });
  });

  describe('Intermediate age values verification', () => {
    it('resolves ages 7 and 8 to BAND_A', () => {
      assert.strictEqual(resolveAgeBand(7), 'BAND_A');
      assert.strictEqual(resolveAgeBand(8), 'BAND_A');
    });

    it('resolves ages 11 and 12 to BAND_B', () => {
      assert.strictEqual(resolveAgeBand(11), 'BAND_B');
      assert.strictEqual(resolveAgeBand(12), 'BAND_B');
    });

    it('resolves ages 15, 16, 17, and 18 to BAND_C', () => {
      assert.strictEqual(resolveAgeBand(15), 'BAND_C');
      assert.strictEqual(resolveAgeBand(16), 'BAND_C');
      assert.strictEqual(resolveAgeBand(17), 'BAND_C');
      assert.strictEqual(resolveAgeBand(18), 'BAND_C');
    });
  });

  describe('Out of range and error conditions', () => {
    it('throws RangeError for ages under 6', () => {
      assert.throws(() => resolveAgeBand(5), RangeError);
      assert.throws(() => resolveAgeBand(0), RangeError);
      assert.throws(() => resolveAgeBand(-1), RangeError);
    });

    it('throws RangeError for ages over 19', () => {
      assert.throws(() => resolveAgeBand(20), RangeError);
      assert.throws(() => resolveAgeBand(25), RangeError);
    });

    it('throws TypeError for non-numeric input', () => {
      // @ts-expect-error test non-number
      assert.throws(() => resolveAgeBand('ten'), TypeError);
      // @ts-expect-error test null
      assert.throws(() => resolveAgeBand(null), TypeError);
    });
  });

  describe('resolveAgeBandSafe graceful clamping', () => {
    it('clamps underage < 6 safely to BAND_A', () => {
      assert.strictEqual(resolveAgeBandSafe(4), 'BAND_A');
      assert.strictEqual(resolveAgeBandSafe(5), 'BAND_A');
    });

    it('clamps overage > 19 safely to BAND_C', () => {
      assert.strictEqual(resolveAgeBandSafe(20), 'BAND_C');
      assert.strictEqual(resolveAgeBandSafe(25), 'BAND_C');
    });
  });

  describe('resolveAgeBandDetails route prefixes and theme linkage', () => {
    it('links Band A to route prefix /(band-a)', () => {
      const details = resolveAgeBandDetails(7);
      assert.strictEqual(details.band, 'BAND_A');
      assert.strictEqual(details.routePrefix, '/(band-a)');
      assert.strictEqual(details.theme.colors.primary, '#D80027');
    });

    it('links Band B to route prefix /(band-b)', () => {
      const details = resolveAgeBandDetails(11);
      assert.strictEqual(details.band, 'BAND_B');
      assert.strictEqual(details.routePrefix, '/(band-b)');
      assert.strictEqual(details.theme.colors.primary, '#D80027');
    });

    it('links Band C to route prefix /(band-c)', () => {
      const details = resolveAgeBandDetails(17);
      assert.strictEqual(details.band, 'BAND_C');
      assert.strictEqual(details.routePrefix, '/(band-c)');
      assert.strictEqual(details.theme.colors.primary, '#12151B');
    });
  });

  describe('isValidStudentAge validator', () => {
    it('returns true only for integers between 6 and 19', () => {
      assert.strictEqual(isValidStudentAge(6), true);
      assert.strictEqual(isValidStudentAge(19), true);
      assert.strictEqual(isValidStudentAge(12), true);
      assert.strictEqual(isValidStudentAge(5), false);
      assert.strictEqual(isValidStudentAge(20), false);
      assert.strictEqual(isValidStudentAge(7.5), false);
    });
  });

  describe('calculateAgeFromBirthDate helper', () => {
    it('correctly calculates age when birthday has passed this year', () => {
      const ref = new Date('2026-09-13T00:00:00Z');
      const birth = new Date('2018-05-10T00:00:00Z');
      assert.strictEqual(calculateAgeFromBirthDate(birth, ref), 8);
    });

    it('correctly calculates age before birthday in current year', () => {
      const ref = new Date('2026-09-13T00:00:00Z');
      const birth = new Date('2018-11-20T00:00:00Z');
      assert.strictEqual(calculateAgeFromBirthDate(birth, ref), 7);
    });

    it('correctly computes exact age on student birthday', () => {
      const ref = new Date('2026-09-13T00:00:00Z');
      const birth = new Date('2016-09-13T00:00:00Z');
      assert.strictEqual(calculateAgeFromBirthDate(birth, ref), 10);
    });

    it('throws TypeError on invalid date string', () => {
      assert.throws(() => calculateAgeFromBirthDate('invalid-date-string'), TypeError);
    });
  });

  describe('isParentContactRequired child-safety rule', () => {
    it('requires parent contact for students under 13 (Band A & early Band B)', () => {
      assert.strictEqual(isParentContactRequired(6), true);
      assert.strictEqual(isParentContactRequired(9), true);
      assert.strictEqual(isParentContactRequired(10), true);
      assert.strictEqual(isParentContactRequired(12), true);
    });

    it('does not require parent contact for students 13 and older', () => {
      assert.strictEqual(isParentContactRequired(13), false);
      assert.strictEqual(isParentContactRequired(14), false);
      assert.strictEqual(isParentContactRequired(18), false);
    });
  });

  describe('checkAgeBandTransition promotion detector', () => {
    it('detects promotion when birthday crosses Band A to Band B threshold (age 9 to 10)', () => {
      const ref = new Date('2026-09-13T00:00:00Z');
      // Born on 2016-09-13 => Exactly 10 on ref date
      const result = checkAgeBandTransition({
        birthDate: '2016-09-13',
        previousBand: 'BAND_A',
        referenceDate: ref,
      });

      assert.strictEqual(result.hasTransitioned, true);
      assert.strictEqual(result.currentAge, 10);
      assert.strictEqual(result.newBand, 'BAND_B');
      assert.strictEqual(result.previousBand, 'BAND_A');
    });

    it('detects promotion when birthday crosses Band B to Band C threshold (age 13 to 14)', () => {
      const ref = new Date('2026-09-13T00:00:00Z');
      // Born on 2012-09-13 => Exactly 14 on ref date
      const result = checkAgeBandTransition({
        birthDate: '2012-09-13',
        previousBand: 'BAND_B',
        referenceDate: ref,
      });

      assert.strictEqual(result.hasTransitioned, true);
      assert.strictEqual(result.currentAge, 14);
      assert.strictEqual(result.newBand, 'BAND_C');
    });

    it('returns hasTransitioned: false when student is still in same band', () => {
      const ref = new Date('2026-09-13T00:00:00Z');
      // Born on 2018-01-01 => 8 years old
      const result = checkAgeBandTransition({
        birthDate: '2018-01-01',
        previousBand: 'BAND_A',
        referenceDate: ref,
      });

      assert.strictEqual(result.hasTransitioned, false);
      assert.strictEqual(result.currentAge, 8);
      assert.strictEqual(result.newBand, 'BAND_A');
    });
  });
});
