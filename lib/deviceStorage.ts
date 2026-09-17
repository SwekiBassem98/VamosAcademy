export interface UserDeviceSettings {
  hasSeenOnboarding: boolean;
  activeRole: 'student' | 'parent' | null;
}

const STORAGE_KEY = 'vamos_device_settings';

// In-memory fallback for environments without persistent local storage
let memorySettings: UserDeviceSettings = {
  hasSeenOnboarding: false,
  activeRole: null,
};

export const getDeviceSettings = (): UserDeviceSettings => {
  return { ...memorySettings };
};

export const setHasSeenOnboarding = (seen: boolean = true): void => {
  memorySettings.hasSeenOnboarding = seen;
};

export const setActiveRole = (role: 'student' | 'parent' | null): void => {
  memorySettings.activeRole = role;
};

export const resetDeviceSettings = (): void => {
  memorySettings = {
    hasSeenOnboarding: false,
    activeRole: null,
  };
};
