export type AgeBand = 'BAND_A' | 'BAND_B' | 'BAND_C';

export interface ColorTokens {
  primary: string;
  primaryContainer: string;
  secondary: string;
  accent: string;
  surface: string;
  surfaceElevated: string;
  textPrimary: string;
  textMuted: string;
  outline: string;
  reward: string;
  feedbackSuccess: string;
  feedbackError: string;
}

export interface TypographyTokens {
  headingDisplay: { fontSize: number; lineHeight: number; fontWeight: string; letterSpacing?: number };
  heading1: { fontSize: number; lineHeight: number; fontWeight: string; letterSpacing?: number };
  heading2: { fontSize: number; lineHeight: number; fontWeight: string };
  bodyLarge: { fontSize: number; lineHeight: number; fontWeight: string };
  bodyRegular: { fontSize: number; lineHeight: number; fontWeight: string };
  label: { fontSize: number; lineHeight: number; fontWeight: string; letterSpacing?: number };
  dataMono?: { fontSize: number; lineHeight: number; fontWeight: string };
}

export interface ComponentStyleTokens {
  buttonRadius: number;
  cardRadius: number;
  badgeRadius: number;
  minTouchTarget: number;
  shadowDepth: string;
  has3DBevel: boolean;
  elevation: number;
}

export interface MascotConfig {
  id: string;
  name: string;
  title: string;
  tone: 'playful_cheering' | 'peer_mentor' | 'collegiate_coach';
  avatarAsset: string;
}

export interface ThemeTokens {
  band: AgeBand;
  name: string;
  targetAgeLabel: string;
  colors: ColorTokens;
  typography: TypographyTokens;
  components: ComponentStyleTokens;
  mascot: MascotConfig;
  darkSupported: boolean;
}
