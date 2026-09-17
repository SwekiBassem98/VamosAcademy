import { apiClient } from './api.ts';
import {
  resolveAgeBand,
  resolveAgeBandSafe,
  calculateAgeFromBirthDate,
  checkAgeBandTransition,
  isParentContactRequired,
} from './themeResolver.ts';
import type { AgeBand } from '../theme/types.ts';

export interface StudentProfile {
  id: string;
  fullName: string;
  emailOrPhone?: string;
  birthDate: string; // ISO string 'YYYY-MM-DD'
  age: number;
  ageBand: AgeBand;
  parentFullName?: string;
  parentContact?: string;
  centerBranch: string; // e.g., "Tunis Central", "Sousse", "Sfax"
  centerStudentCode: string;
  avatarSeed: string;
  enrolledDate: string;
  hasPendingLevelUp?: boolean;
  previousBand?: AgeBand;
}

export interface AuthSession {
  token: string;
  student: StudentProfile;
  hasLeveledUp?: boolean;
  previousBand?: AgeBand;
  newBand?: AgeBand;
}

// In-memory backend persistence table simulating Prisma database store
const studentDatabase = new Map<string, StudentProfile>();

export async function authenticateStudent(credentials: {
  studentCode: string;
  accessPin: string;
}): Promise<AuthSession> {
  // Check in local database or simulate backend response
  let student = studentDatabase.get(credentials.studentCode);
  
  if (!student) {
    // Check if matching student exists
    for (const s of studentDatabase.values()) {
      if (s.centerStudentCode === credentials.studentCode || s.emailOrPhone === credentials.studentCode) {
        student = s;
        break;
      }
    }
  }

  // Fallback demo student if code not found
  if (!student) {
    student = createStudentProfile({
      id: 'demo_' + Date.now(),
      fullName: 'Youssef Mansouri',
      birthDate: '2016-04-12',
      centerBranch: 'Tunis Central',
      centerStudentCode: credentials.studentCode || 'VA-10-8842',
    });
  }

  // Check on login if birthday pushed them into a higher band
  const transitionCheck = checkAgeBandTransition({
    birthDate: student.birthDate,
    previousBand: student.ageBand,
  });

  if (transitionCheck.hasTransitioned) {
    student = {
      ...student,
      age: transitionCheck.currentAge,
      previousBand: student.ageBand,
      ageBand: transitionCheck.newBand,
      hasPendingLevelUp: true,
    };
    studentDatabase.set(student.id, student);

    return {
      token: 'jwt_session_' + Date.now(),
      student,
      hasLeveledUp: true,
      previousBand: transitionCheck.previousBand,
      newBand: transitionCheck.newBand,
    };
  }

  return {
    token: 'jwt_session_' + Date.now(),
    student,
    hasLeveledUp: false,
  };
}

export function createStudentProfile(params: {
  id: string;
  fullName: string;
  birthDate?: string;
  age?: number;
  emailOrPhone?: string;
  parentFullName?: string;
  parentContact?: string;
  centerBranch?: string;
  centerStudentCode?: string;
}): StudentProfile {
  let computedAge = params.age ?? 8;
  if (params.birthDate) {
    computedAge = calculateAgeFromBirthDate(params.birthDate);
  }

  const ageBand = resolveAgeBandSafe(computedAge);
  const birthDateStr = params.birthDate || new Date(Date.now() - computedAge * 365.25 * 24 * 3600 * 1000).toISOString().split('T')[0];

  const profile: StudentProfile = {
    id: params.id,
    fullName: params.fullName,
    emailOrPhone: params.emailOrPhone,
    birthDate: birthDateStr,
    age: computedAge,
    ageBand,
    parentFullName: params.parentFullName,
    parentContact: params.parentContact,
    centerBranch: params.centerBranch || 'Tunis Central',
    centerStudentCode: params.centerStudentCode || `VA-${computedAge}-${Math.floor(1000 + Math.random() * 9000)}`,
    avatarSeed: params.fullName.toLowerCase().replace(/\s+/g, '_'),
    enrolledDate: new Date().toISOString(),
    hasPendingLevelUp: false,
  };

  studentDatabase.set(profile.id, profile);
  return profile;
}

/**
 * Executes a simulated birthday advance to test the Level-Up transition screen.
 */
export function simulateBirthdayAdvance(student: StudentProfile, yearsToAdd: number = 3): {
  updatedStudent: StudentProfile;
  leveledUp: boolean;
  previousBand: AgeBand;
  newBand: AgeBand;
} {
  const currentBirthDate = new Date(student.birthDate);
  currentBirthDate.setFullYear(currentBirthDate.getFullYear() - yearsToAdd);
  const newBirthDateStr = currentBirthDate.toISOString().split('T')[0];
  const newAge = calculateAgeFromBirthDate(newBirthDateStr);
  const newBand = resolveAgeBandSafe(newAge);
  const leveledUp = newBand !== student.ageBand;

  const updated: StudentProfile = {
    ...student,
    birthDate: newBirthDateStr,
    age: newAge,
    previousBand: student.ageBand,
    ageBand: newBand,
    hasPendingLevelUp: leveledUp,
  };

  studentDatabase.set(updated.id, updated);
  return {
    updatedStudent: updated,
    leveledUp,
    previousBand: student.ageBand,
    newBand,
  };
}
