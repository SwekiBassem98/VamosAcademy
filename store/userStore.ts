import { create } from 'zustand';
import type { StudentProfile } from '../lib/auth.ts';
import type { AgeBand } from '../theme/types.ts';
import { resolveAgeBandSafe, checkAgeBandTransition, calculateAgeFromBirthDate } from '../lib/themeResolver.ts';
import { getDeviceSettings, setHasSeenOnboarding as persistHasSeenOnboarding, setActiveRole as persistActiveRole } from '../lib/deviceStorage.ts';

interface LevelUpInfo {
  previousBand: AgeBand;
  newBand: AgeBand;
  newAge: number;
}

export type ActiveRole = 'student' | 'parent' | null;

interface UserState {
  student: StudentProfile | null;
  isAuthenticated: boolean;
  activeRole: ActiveRole;
  hasSeenOnboarding: boolean;
  selectedAge: number;
  currentBand: AgeBand;
  showLevelUpModal: boolean;
  levelUpInfo: LevelUpInfo | null;
  
  // Actions
  setStudent: (student: StudentProfile) => void;
  setParentUser: () => void;
  setOnboardingSeen: () => void;
  updateAge: (age: number) => void;
  setGuestStudent: (age: number, name?: string) => void;
  checkBirthdayLevelUp: () => boolean;
  triggerSimulatedLevelUp: (targetBand?: AgeBand) => void;
  acknowledgeLevelUp: () => void;
  closeLevelUpModal: () => void;
  logout: () => void;
}

const initialDeviceSettings = getDeviceSettings();

export const useUserStore = create<UserState>((set, get) => ({
  student: null,
  isAuthenticated: false,
  activeRole: initialDeviceSettings.activeRole,
  hasSeenOnboarding: initialDeviceSettings.hasSeenOnboarding,
  selectedAge: 8,
  currentBand: 'BAND_A',
  showLevelUpModal: false,
  levelUpInfo: null,

  setStudent: (student) => {
    persistActiveRole('student');
    // Also run transition check immediately on login/set
    const transition = checkAgeBandTransition({
      birthDate: student.birthDate,
      previousBand: student.ageBand,
    });

    if (transition.hasTransitioned) {
      set({
        student: {
          ...student,
          age: transition.currentAge,
          ageBand: transition.newBand,
          previousBand: student.ageBand,
          hasPendingLevelUp: true,
        },
        isAuthenticated: true,
        activeRole: 'student',
        selectedAge: transition.currentAge,
        currentBand: transition.newBand,
        showLevelUpModal: true,
        levelUpInfo: {
          previousBand: student.ageBand,
          newBand: transition.newBand,
          newAge: transition.currentAge,
        },
      });
    } else {
      set({
        student,
        isAuthenticated: true,
        activeRole: 'student',
        selectedAge: student.age,
        currentBand: student.ageBand,
        showLevelUpModal: Boolean(student.hasPendingLevelUp && student.previousBand),
        levelUpInfo: student.hasPendingLevelUp && student.previousBand ? {
          previousBand: student.previousBand,
          newBand: student.ageBand,
          newAge: student.age,
        } : null,
      });
    }
  },

  setParentUser: () => {
    persistActiveRole('parent');
    set({
      isAuthenticated: true,
      activeRole: 'parent',
      showLevelUpModal: false,
      levelUpInfo: null,
    });
  },

  setOnboardingSeen: () => {
    persistHasSeenOnboarding(true);
    set({ hasSeenOnboarding: true });
  },

  updateAge: (age) => {
    const band = resolveAgeBandSafe(age);
    const birthYear = new Date().getFullYear() - age;
    const syntheticBirthDate = `${birthYear}-01-15`;
    set((state) => ({
      selectedAge: age,
      currentBand: band,
      student: state.student ? {
        ...state.student,
        age,
        ageBand: band,
        birthDate: syntheticBirthDate,
      } : null,
    }));
  },

  setGuestStudent: (age, name = 'Student') => {
    persistActiveRole('student');
    const band = resolveAgeBandSafe(age);
    const birthYear = new Date().getFullYear() - age;
    const guestStudent: StudentProfile = {
      id: 'guest_user',
      fullName: name,
      emailOrPhone: 'guest@vamosacademy.tn',
      birthDate: `${birthYear}-05-20`,
      age,
      ageBand: band,
      parentFullName: age < 13 ? 'Parent Guardian' : undefined,
      parentContact: age < 13 ? '+216 71 000 000' : undefined,
      centerBranch: 'Tunis Central',
      centerStudentCode: `VA-GUEST-${age}`,
      avatarSeed: 'guest',
      enrolledDate: new Date().toISOString(),
      hasPendingLevelUp: false,
    };
    set({
      student: guestStudent,
      isAuthenticated: true,
      activeRole: 'student',
      selectedAge: age,
      currentBand: band,
      showLevelUpModal: false,
      levelUpInfo: null,
    });
  },

  checkBirthdayLevelUp: () => {
    const { student } = get();
    if (!student || !student.birthDate) return false;

    const transition = checkAgeBandTransition({
      birthDate: student.birthDate,
      previousBand: student.ageBand,
    });

    if (transition.hasTransitioned) {
      set({
        student: {
          ...student,
          age: transition.currentAge,
          ageBand: transition.newBand,
          previousBand: student.ageBand,
          hasPendingLevelUp: true,
        },
        selectedAge: transition.currentAge,
        currentBand: transition.newBand,
        showLevelUpModal: true,
        levelUpInfo: {
          previousBand: student.ageBand,
          newBand: transition.newBand,
          newAge: transition.currentAge,
        },
      });
      return true;
    }
    return false;
  },

  triggerSimulatedLevelUp: (targetBand) => {
    const { currentBand, student } = get();
    let nextBand: AgeBand = 'BAND_B';
    let nextAge = 10;

    if (targetBand) {
      nextBand = targetBand;
      nextAge = targetBand === 'BAND_B' ? 10 : 14;
    } else {
      if (currentBand === 'BAND_A') {
        nextBand = 'BAND_B';
        nextAge = 10;
      } else if (currentBand === 'BAND_B') {
        nextBand = 'BAND_C';
        nextAge = 15;
      } else {
        nextBand = 'BAND_A';
        nextAge = 8;
      }
    }

    const birthYear = new Date().getFullYear() - nextAge;
    const newBirthDate = `${birthYear}-01-10`;

    set({
      currentBand: nextBand,
      selectedAge: nextAge,
      showLevelUpModal: true,
      levelUpInfo: {
        previousBand: currentBand,
        newBand: nextBand,
        newAge: nextAge,
      },
      student: student ? {
        ...student,
        age: nextAge,
        ageBand: nextBand,
        previousBand: currentBand,
        birthDate: newBirthDate,
        hasPendingLevelUp: true,
      } : null,
    });
  },

  acknowledgeLevelUp: () => {
    const { student } = get();
    set({
      showLevelUpModal: false,
      levelUpInfo: null,
      student: student ? {
        ...student,
        hasPendingLevelUp: false,
        previousBand: undefined,
      } : null,
    });
  },

  closeLevelUpModal: () => {
    set({ showLevelUpModal: false });
  },

  logout: () => {
    persistActiveRole(null);
    set({
      student: null,
      isAuthenticated: false,
      activeRole: null,
      selectedAge: 8,
      currentBand: 'BAND_A',
      showLevelUpModal: false,
      levelUpInfo: null,
    });
  },
}));

