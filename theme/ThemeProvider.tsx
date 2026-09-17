import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import type { AgeBand, ThemeTokens } from './types.ts';
import { THEMES_BY_BAND, BAND_A_THEME } from './tokens.ts';
import { resolveAgeBandSafe, resolveAgeBandDetails, AgeBandResolution } from '../lib/themeResolver.ts';

interface ThemeContextValue {
  theme: ThemeTokens;
  band: AgeBand;
  age: number;
  details: AgeBandResolution;
  isDark: boolean;
  setStudentAge: (age: number) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  initialAge?: number;
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  initialAge = 8,
  children,
}) => {
  const [age, setAge] = useState<number>(initialAge);
  const [isDark, setIsDark] = useState<boolean>(false);

  const details = useMemo(() => resolveAgeBandDetails(age), [age]);
  const currentBand = details.band;

  const activeTheme = useMemo(() => {
    return THEMES_BY_BAND[currentBand] || BAND_A_THEME;
  }, [currentBand]);

  const value = useMemo<ThemeContextValue>(() => ({
    theme: activeTheme,
    band: currentBand,
    age,
    details,
    isDark,
    setStudentAge: (newAge: number) => setAge(newAge),
    toggleDarkMode: () => setIsDark((prev) => !prev),
  }), [activeTheme, currentBand, age, details, isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a <ThemeProvider>');
  }
  return context;
};

export default ThemeProvider;
