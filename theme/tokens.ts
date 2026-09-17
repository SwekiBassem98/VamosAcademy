import type { AgeBand, ThemeTokens } from './types.ts';

/**
 * Base Club Africain Brand Palette
 * Sampled directly from:
 * - ca-logo.png (crest shield, Arabic calligraphy, monogram)
 * - kit.jpeg (2024-2025 home kit crimson hoops)
 * - kit2.jpeg (2024-2025 away kit cobalt blue & dark charcoal trim)
 */
export const BRAND_PALETTE = {
  primary: '#D80027', // Club Africain Rouge Sang (Deep Saturated Red)
  secondary: '#1A56C4', // Away Kit Cobalt Blue
  dark: '#12151B', // Kit Trim & Linework Near-Black Charcoal
  light: '#FFFFFF', // Pure White Counter-Color

  // 4-5 Tint / Shade steps for hover, backgrounds, and borders
  red: {
    50: '#FDF2F4',
    100: '#FDE2E6',
    200: '#F9B3BD',
    500: '#D80027',
    600: '#B70020',
    700: '#8E0019',
    900: '#54000F',
  },
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    500: '#1A56C4',
    600: '#1545A3',
    700: '#0F337B',
    900: '#0A1F4C',
  },
  darkSteps: {
    50: '#F8FAFC',
    100: '#E2E8F0',
    300: '#94A3B8',
    500: '#64748B',
    700: '#1E2430',
    900: '#12151B',
    950: '#0B0D11',
  },
  lightSteps: {
    50: '#FFFFFF',
    100: '#FAFAFA',
    200: '#FFFDF9',
    300: '#F3F4F6',
    400: '#E5E7EB',
  },
} as const;

export const BAND_A_THEME: ThemeTokens = {
  band: 'BAND_A',
  name: 'The Explorers',
  targetAgeLabel: 'Ages 6–9',
  colors: {
    primary: BRAND_PALETTE.primary, // #D80027 Bold Red Accent for action buttons & celebratory badges
    primaryContainer: BRAND_PALETTE.red[100], // #FDE2E6 Soft Rose Cream
    secondary: BRAND_PALETTE.secondary, // #1A56C4 Bold Blue Accent for explorer tags & pills
    accent: '#FFBA08', // Solar Star Gold for reward stars & medals
    surface: '#FFFDF9', // Soft warm cream canvas (avoids dominant red flood)
    surfaceElevated: '#FFFFFF', // Pure White
    textPrimary: BRAND_PALETTE.dark, // #12151B Charcoal readability
    textMuted: BRAND_PALETTE.darkSteps[500], // #64748B
    outline: BRAND_PALETTE.red[100], // Soft red tint boundary
    reward: '#FFBA08',
    feedbackSuccess: '#10B981',
    feedbackError: BRAND_PALETTE.primary,
  },
  typography: {
    headingDisplay: { fontSize: 32, lineHeight: 40, fontWeight: '800', letterSpacing: 0.5 },
    heading1: { fontSize: 24, lineHeight: 32, fontWeight: '700', letterSpacing: 0.3 },
    heading2: { fontSize: 20, lineHeight: 26, fontWeight: '700' },
    bodyLarge: { fontSize: 18, lineHeight: 26, fontWeight: '500' },
    bodyRegular: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
    label: { fontSize: 18, lineHeight: 22, fontWeight: '800', letterSpacing: 0.8 },
  },
  components: {
    buttonRadius: 28,
    cardRadius: 24,
    badgeRadius: 18,
    minTouchTarget: 56,
    shadowDepth: '0 4px 0 #B70020', // 3D compression bevel using red.600
    has3DBevel: true,
    elevation: 4,
  },
  mascot: {
    id: 'fennec_youssef',
    name: 'Youssef the Fennec',
    title: 'Academy Explorer Guide',
    tone: 'playful_cheering',
    avatarAsset: 'mascot_band_a.png',
  },
  darkSupported: false,
};

export const BAND_B_THEME: ThemeTokens = {
  band: 'BAND_B',
  name: 'The Adventurers',
  targetAgeLabel: 'Ages 10–13',
  colors: {
    primary: BRAND_PALETTE.primary, // #D80027 Red as primary action/progress color
    primaryContainer: BRAND_PALETTE.red[100], // #FDE2E6
    secondary: BRAND_PALETTE.secondary, // #1A56C4 Blue as secondary accent for leaderboard & competition
    accent: BRAND_PALETTE.secondary, // #1A56C4 Cobalt Blue competitive accent
    surface: '#F8FAFC', // Crisp Slate Chalk
    surfaceElevated: '#FFFFFF', // Pure Frost White
    textPrimary: BRAND_PALETTE.dark, // #12151B Midnight Charcoal
    textMuted: BRAND_PALETTE.darkSteps[500], // #64748B Slate Gray
    outline: '#E2E8F0', // Geometric outline border
    reward: BRAND_PALETTE.primary, // Red XP & streak milestones
    feedbackSuccess: '#10B981',
    feedbackError: BRAND_PALETTE.primary,
  },
  typography: {
    headingDisplay: { fontSize: 28, lineHeight: 36, fontWeight: '800', letterSpacing: -0.5 },
    heading1: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
    heading2: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
    bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
    bodyRegular: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
    label: { fontSize: 15, lineHeight: 20, fontWeight: '600', letterSpacing: 0.4 },
  },
  components: {
    buttonRadius: 14,
    cardRadius: 16,
    badgeRadius: 10,
    minTouchTarget: 48,
    shadowDepth: '0 4px 12px rgba(216, 0, 39, 0.10)',
    has3DBevel: false,
    elevation: 3,
  },
  mascot: {
    id: 'vanguard_mentor',
    name: 'The Vamos Vanguard',
    title: 'Mission Navigator',
    tone: 'peer_mentor',
    avatarAsset: 'mascot_band_b.png',
  },
  darkSupported: true,
};

export const BAND_C_THEME: ThemeTokens = {
  band: 'BAND_C',
  name: 'The Scholars',
  targetAgeLabel: 'Ages 14–19',
  colors: {
    primary: BRAND_PALETTE.dark, // #12151B Near-black charcoal doing most visual weight
    primaryContainer: BRAND_PALETTE.darkSteps[700], // #1E2430 Dark charcoal slate container
    secondary: BRAND_PALETTE.secondary, // #1A56C4 Away kit blue doing secondary visual weight
    accent: BRAND_PALETTE.primary, // #D80027 Red as sparing accent color (buttons, active states)
    surface: '#F8F9FA', // Off-white Gallery Linen
    surfaceElevated: '#FFFFFF', // Pure White
    textPrimary: BRAND_PALETTE.dark, // #12151B
    textMuted: BRAND_PALETTE.darkSteps[500], // #64748B Cool Graphite Grey
    outline: '#E5E7EB', // Hairline border
    reward: BRAND_PALETTE.primary, // Sparing red distinction ribbon
    feedbackSuccess: '#059669',
    feedbackError: BRAND_PALETTE.primary,
  },
  typography: {
    headingDisplay: { fontSize: 26, lineHeight: 34, fontWeight: '700', letterSpacing: -0.6 },
    heading1: { fontSize: 20, lineHeight: 26, fontWeight: '600' },
    heading2: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
    bodyLarge: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
    bodyRegular: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
    label: { fontSize: 14, lineHeight: 18, fontWeight: '500', letterSpacing: 0.2 },
    dataMono: { fontSize: 12, lineHeight: 16, fontWeight: '600' },
  },
  components: {
    buttonRadius: 10,
    cardRadius: 12,
    badgeRadius: 6,
    minTouchTarget: 48,
    shadowDepth: '0 1px 3px rgba(18, 21, 27, 0.08)',
    has3DBevel: false,
    elevation: 1,
  },
  mascot: {
    id: 'academy_crest',
    name: 'Vamos Academic Honors',
    title: 'Baccalaureate Fellow',
    tone: 'collegiate_coach',
    avatarAsset: 'crest_band_c.png',
  },
  darkSupported: true,
};

export const THEMES_BY_BAND: Record<AgeBand, ThemeTokens> = {
  BAND_A: BAND_A_THEME,
  BAND_B: BAND_B_THEME,
  BAND_C: BAND_C_THEME,
};

