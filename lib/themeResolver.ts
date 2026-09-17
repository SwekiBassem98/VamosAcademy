import type { AgeBand, ThemeTokens } from '../theme/types.ts';
import { THEMES_BY_BAND, BAND_A_THEME, BAND_B_THEME, BAND_C_THEME } from '../theme/tokens.ts';

export const MIN_STUDENT_AGE = 6;
export const MAX_STUDENT_AGE = 19;

export interface AgeBandResolution {
  band: AgeBand;
  age: number;
  displayName: string;
  routePrefix: string;
  theme: ThemeTokens;
}

/**
 * Checks whether an age falls within the accepted Vamos Academy student range (6–19).
 */
export function isValidStudentAge(age: number): boolean {
  return Number.isInteger(age) && age >= MIN_STUDENT_AGE && age <= MAX_STUDENT_AGE;
}

/**
 * Child safety check: Students under age 13 require parent/guardian contact information.
 * Applicable to Band A (6–9) and most of Band B (10–12).
 */
export function isParentContactRequired(age: number): boolean {
  return age < 13;
}

/**
 * Calculates exact student age in full years from a birth date string or Date object.
 * Correctly accounts for month and day relative to referenceDate (defaults to now).
 */
export function calculateAgeFromBirthDate(
  birthDate: string | Date,
  referenceDate: Date = new Date()
): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  if (Number.isNaN(birth.getTime())) {
    throw new TypeError('Invalid birthDate string or Date object provided');
  }

  let age = referenceDate.getFullYear() - birth.getFullYear();
  const monthDiff = referenceDate.getMonth() - birth.getMonth();
  const dayDiff = referenceDate.getDate() - birth.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

/**
 * Transition detector: Computes current age from birthdate and checks if the student's
 * developmental band has promoted to a new tier (e.g. Band A -> Band B, or Band B -> Band C).
 */
export function checkAgeBandTransition(params: {
  birthDate: string | Date;
  previousBand: AgeBand;
  referenceDate?: Date;
}): {
  hasTransitioned: boolean;
  currentAge: number;
  newBand: AgeBand;
  previousBand: AgeBand;
} {
  const currentAge = calculateAgeFromBirthDate(params.birthDate, params.referenceDate);
  const newBand = resolveAgeBandSafe(currentAge);
  return {
    hasTransitioned: newBand !== params.previousBand,
    currentAge,
    newBand,
    previousBand: params.previousBand,
  };
}

/**
 * Core Resolver: Resolves a student's age into their assigned developmental AgeBand.
 *
 * Age Bands:
 * - Band A: 6–9   (Early Primary — "The Explorers")
 * - Band B: 10–13 (Upper Primary / Early Teen — "The Adventurers")
 * - Band C: 14–19 (High School / Baccalaureate — "The Scholars")
 *
 * @throws {RangeError} if age is outside the 6–19 bracket or not a valid integer.
 */
export function resolveAgeBand(age: number): AgeBand {
  if (typeof age !== 'number' || Number.isNaN(age)) {
    throw new TypeError(`Invalid age value: expected integer, received ${typeof age}`);
  }

  const roundedAge = Math.floor(age);

  if (roundedAge < MIN_STUDENT_AGE || roundedAge > MAX_STUDENT_AGE) {
    throw new RangeError(
      `Student age ${age} is outside the allowed Vamos Academy spectrum (6–19 years).`
    );
  }

  if (roundedAge <= 9) {
    return 'BAND_A';
  }

  if (roundedAge <= 13) {
    return 'BAND_B';
  }

  return 'BAND_C';
}

/**
 * Safe version of resolveAgeBand that clamps out-of-range values instead of throwing.
 * Clamps age < 6 to BAND_A, and age > 19 to BAND_C.
 */
export function resolveAgeBandSafe(age: number): AgeBand {
  if (typeof age !== 'number' || Number.isNaN(age)) {
    return 'BAND_A';
  }
  if (age < MIN_STUDENT_AGE) return 'BAND_A';
  if (age > MAX_STUDENT_AGE) return 'BAND_C';
  return resolveAgeBand(age);
}

/**
 * Resolves full age-band metadata including theme tokens, display label, and route prefix.
 */
export function resolveAgeBandDetails(age: number): AgeBandResolution {
  const band = resolveAgeBand(age);
  const theme = THEMES_BY_BAND[band];

  const routePrefixMap: Record<AgeBand, string> = {
    BAND_A: '/(band-a)',
    BAND_B: '/(band-b)',
    BAND_C: '/(band-c)',
  };

  return {
    band,
    age,
    displayName: theme.name,
    routePrefix: routePrefixMap[band],
    theme,
  };
}

/**
 * Direct theme token getter by band ID.
 */
export function getThemeForBand(band: AgeBand): ThemeTokens {
  switch (band) {
    case 'BAND_A':
      return BAND_A_THEME;
    case 'BAND_B':
      return BAND_B_THEME;
    case 'BAND_C':
      return BAND_C_THEME;
    default:
      return BAND_A_THEME;
  }
}

/**
 * Direct theme token getter by student age.
 */
export function getThemeForAge(age: number): ThemeTokens {
  const band = resolveAgeBandSafe(age);
  return getThemeForBand(band);
}
