# Vamos Academy — Adaptive Design System Spec
**Document Version:** 2.0.0 (Club Africain Identity System)  
**Target Platform:** Mobile (iOS / Android)  
**Brand Identity:** *Vamos Academy* (Tunisia) — Rebranded with the storied visual heritage of **Club Africain** (Tunis, est. 1920), marrying deep saturated crimson red, Mediterranean away-kit cobalt blue, pure white counter-color, and architectural dark charcoal.

---

## 1. System Architecture & Base Brand Palette

Every student at *Vamos Academy* enters the same academy, but their sensory and cognitive experience is custom-tailored to their developmental stage. 

The design system is anchored in a unified **Club Africain Core Palette** sampled directly from the official club assets:
- **`ca-logo.png`**: The historic shield crest with pure white calligraphy, monogram, and deep saturated red stripes.
- **`kit.jpeg`**: The 2024–2025 home jersey featuring iconic horizontal crimson-and-white hoops, lion watermark, and dark charcoal linework.
- **`kit2.jpeg`**: The 2024–2025 away jersey featuring deep cobalt royal blue, dark charcoal goalkeeper/trim base, crisp white numbers, and red center vertical stripes.

### 1.1 Base Extracted Palette & Tint/Shade Steps

| Token | Hex | Name | Origin / Sampling Source |
|---|---|---|---|
| `brand.primary` | `#D80027` | Club Africain Rouge Sang | Deep, saturated red from crest and home kit stripes |
| `brand.secondary` | `#1A56C4` | Mediterranean Cobalt Blue | 2024–2025 Away Kit jersey body and banner typography |
| `brand.dark` | `#12151B` | Kit Trim & Crest Charcoal | Near-black linework, Umbro diamond badge, GK kit base |
| `brand.light` | `#FFFFFF` | Pure White Counter-Color | Crest horizontal bands, Arabic calligraphy, and home kit hoops |

#### Tint & Shade Scales

```
[brand.primary — Club Africain Crimson Red #D80027]
  ├── red.50  : #FDF2F4 (Softest blush wash / surface tint)
  ├── red.100 : #FDE2E6 (Light container fill, badge backing, pill tag)
  ├── red.200 : #F9B3BD (Soft border, subtle highlight stroke)
  ├── red.500 : #D80027 (BASE PRIMARY RED — Buttons, active states, progress fills)
  ├── red.600 : #B70020 (Hover state, 3D compression bevel base)
  ├── red.700 : #8E0019 (Pressed depth, dark accent)
  └── red.900 : #54000F (Deepest crimson linework)

[brand.secondary — Away Kit Cobalt Blue #1A56C4]
  ├── blue.50  : #EFF6FF (Softest blue tint wash)
  ├── blue.100 : #DBEAFE (Active tab pill, leaderboard rank badge)
  ├── blue.200 : #BFDBFE (Subtle border division stroke)
  ├── blue.500 : #1A56C4 (BASE SECONDARY BLUE — Leaderboards, quest leagues, analytics)
  ├── blue.600 : #1545A3 (Hover / active blue state)
  ├── blue.700 : #0F337B (Deep navy accent)
  └── blue.900 : #0A1F4C (Midnight blue container)

[brand.dark — Linework & Trim Charcoal #12151B]
  ├── dark.50  : #F8FAFC (Airy neutral background)
  ├── dark.100 : #E2E8F0 (Division stroke, card outline)
  ├── dark.300 : #94A3B8 (Placeholder, disabled stroke)
  ├── dark.500 : #64748B (Muted typography, captions, metadata)
  ├── dark.700 : #1E2430 (Elevated dark mode container, deep card)
  ├── dark.900 : #12151B (BASE DARK CHARCOAL — High-contrast primary typography)
  └── dark.950 : #0B0D11 (Pitch black OLED backdrop)

[brand.light — Pure White Counter-Color #FFFFFF]
  ├── light.50  : #FFFFFF (Pure White counter-color, raised card surface)
  ├── light.100 : #FAFAFA (Soft milk white)
  ├── light.200 : #FFFDF9 (Warm vanilla alabaster — Band A canvas)
  ├── light.300 : #F3F4F6 (Neutral surface container)
  └── light.400 : #E5E7EB (Hairline card outline)
```

---

## 2. Band A: "The Explorers" (Ages 6–9 / Early Primary)

### 2.1 Core Intent & UX Principles
- **Cognitive Load:** Minimal textual density. Reliance on high-contrast iconography, voice guidance affordances, rich spatial affordances, and tactile cards.
- **Interaction Model:** Oversized tap targets (minimum 56–64dp). Multi-sensory rewards: stars, physical badge stickers, celebratory particle cascades, bouncing micro-interactions.
- **Color Philosophy:** Keep it playful — use the red and blue as **bold, saturated accent colors** against soft white/cream backgrounds (`#FFFDF9`, `#FDE2E6`), not as heavy or overwhelming dominant fills.
- **Session Cadence:** Short bursts (3–6 minute micro-quests).
- **Mascot & Tone:** "Youssef the Fennec" — expressive, animated, guiding step-by-step with encouraging, celebratory tone ("Awesome work, Champion!", "Tap the magic star!").

### 2.2 Color Palette

| Token | Hex | Name / Usage |
|---|---|---|
| `primary` | `#D80027` | Club Africain Red (Bold tactile action buttons, celebration callouts) |
| `primaryContainer` | `#FDE2E6` | Soft Rose Cream (Tile card backings, focus highlights) |
| `secondary` | `#1A56C4` | Club Africain Blue (Bold explorer badges, subject pills, play modes) |
| `accent` | `#FFBA08` | Solar Star Gold (Celebratory stars, reward tokens, treasure chests) |
| `surface` | `#FFFDF9` | Warm Vanilla Alabaster (Soft non-glare canvas — avoids red flood) |
| `surfaceElevated` | `#FFFFFF` | Pure White (Raised interactive tile cards) |
| `textPrimary` | `#12151B` | Brand Dark Charcoal (Maximum readability, softer than harsh #000) |
| `textMuted` | `#64748B` | Slate Gray (Auxiliary notes, mission steps) |
| `outline` | `#FDE2E6` | Soft Red Tint Stroke (Gentle containment borders) |
| `reward` | `#FFBA08` | Star Gold (Earned stars, sticker badge unlocks) |
| `feedbackSuccess` | `#10B981` | Cheerful Emerald (Correct answers) |
| `feedbackError` | `#D80027` | Brand Red (Try again alert) |

### 2.3 Type Scale
Friendly, rounded, geometric typography with generous letter tracking and ample line heights (e.g., Nunito / Baloo / Quicksand).

- **Heading Display:** `32sp` (ExtraBold, LineHeight: `40sp`, LetterSpacing: `+0.5sp`)
- **Heading 1:** `24sp` (Bold, LineHeight: `32sp`, LetterSpacing: `+0.3sp`)
- **Heading 2:** `20sp` (Bold, LineHeight: `26sp`)
- **Body Large:** `18sp` (Medium, LineHeight: `26sp`)
- **Body Regular:** `16sp` (Regular/Medium, LineHeight: `24sp`)
- **Label / Button:** `18sp` (Bold, Uppercase/Chunky, LineHeight: `22sp`, Tracking: `+0.8sp`)

### 2.4 Component Style & Elevation
- **Corner Radius:** `28dp` (Pill buttons `28dp`, Large Quest Cards `24dp`, Modal Sheets `32dp`).
- **Shadow Depth & Tactility:** Chunky neo-tactile buttons with a solid 3D bottom bevel (`4dp` offset border in `#B70020` shade) that compresses to `0dp` upon click/press.
- **Icon Style:** 3D-shaded or dual-tone filled vector glyphs with rounded stroke terminators.
- **Touch Target:** Minimum `56dp x 56dp` interactive hit areas.

---

## 3. Band B: "The Adventurers" (Ages 10–13 / Upper Primary & Early Teen)

### 3.1 Core Intent & UX Principles
- **Cognitive Load:** Balanced structure. Modular information architecture with tabbed categories, structured exercise sets, and clear difficulty tiering.
- **Interaction Model:** Gamified streaks, guild badges, level progression ladders, and customizable avatar gear. Clear feedback loops and challenge mechanics.
- **Color Philosophy:** **Red** serves as the primary action/progress color, while **blue** acts as the high-energy secondary accent for the leaderboard, guilds, and competitive league elements.
- **Session Cadence:** Structured missions (10–18 minutes) with milestones and bonus multiplier rounds.
- **Mascot & Tone:** "The Vamos Vanguard" — stylized cyber-mentor who talks peer-to-peer ("Level 4 unlocked! You’re on a 5-day streak. Ready for the challenge?").

### 3.2 Color Palette

| Token | Hex | Name / Usage |
|---|---|---|
| `primary` | `#D80027` | Club Africain Red (Primary action buttons, XP progress bars, streak flame) |
| `primaryContainer` | `#FDE2E6` | Soft Crimson Tint (Active tab pills, highlight cards) |
| `secondary` | `#1A56C4` | Club Africain Blue (Leaderboard podium, challenge gauntlet, guild badge) |
| `accent` | `#1A56C4` | Cobalt Blue Accent (Competitive league chips, cyber elements) |
| `surface` | `#F8FAFC` | Crisp Slate Chalk (Clean, focused background) |
| `surfaceElevated` | `#FFFFFF` | Pure Frost White (Elevated cards and exercise panels) |
| `textPrimary` | `#12151B` | Midnight Charcoal (Razor-sharp contrast) |
| `textMuted` | `#64748B` | Slate Gray (Timestamps, difficulty tags) |
| `outline` | `#E2E8F0` | Geometric outline border (Clean 1.5dp division lines) |
| `reward` | `#D80027` | Brand Red (XP points, level-up celebration banners) |
| `feedbackSuccess` | `#10B981` | Vivid Mint (Correct response) |
| `feedbackError` | `#D80027` | Brand Red (Incorrect response) |

### 3.3 Type Scale
Modern, energetic sans-serif with geometric precision (e.g., Plus Jakarta Sans / Poppins).

- **Heading Display:** `28sp` (ExtraBold, LineHeight: `36sp`, LetterSpacing: `-0.5sp`)
- **Heading 1:** `22sp` (Bold, LineHeight: `28sp`)
- **Heading 2:** `18sp` (SemiBold, LineHeight: `24sp`)
- **Body Large:** `16sp` (Regular/Medium, LineHeight: `24sp`)
- **Body Regular:** `14sp` (Regular, LineHeight: `20sp`)
- **Label / Button:** `15sp` (SemiBold, LineHeight: `20sp`, Tracking: `+0.4sp`)

### 3.4 Component Style & Elevation
- **Corner Radius:** `14dp` (Buttons `14dp`, Cards `16dp`, Badges `10dp`).
- **Shadow Depth:** Crisp floating drop shadows (`0 4px 12px rgba(216, 0, 39, 0.10)`), subtle micro-elevations on hover/drag.
- **Icon Style:** Modern dual-tone line + fill icons (Material Symbols Outlined with blue & red tinted chips).
- **Touch Target:** Standard `48dp x 48dp` target size with snappy tactile response.

---

## 4. Band C: "The Scholars" (Ages 14–19 / High School & Baccalaureate)

### 4.1 Core Intent & UX Principles
- **Cognitive Load:** Data-driven, distraction-free productivity. Rich progress analytics, mastery radar charts, exam readiness scores, study timers, and peer leaderboards.
- **Interaction Model:** Sleek gestures, haptic taps, fluid micro-transitions, dark-mode native support, and dense multi-choice or open-response exercise layouts.
- **Color Philosophy:** More restrained — **red is used as a sparing accent color** (action buttons, urgent active states, distinction seals), while **blue and near-black do most of the heavy visual weight**, mirroring the clean balance of the Club Africain away kit (dark GK / cobalt player kit / red trim).
- **Session Cadence:** Focused deep-work sessions (25–45 minutes with Pomodoro intervals and Baccalaureate revision modules).
- **Mascot & Tone:** No cartoon mascot. Elegant crest/emblem presence and a sophisticated, collegiate coaching voice ("Exam prep: 84% accuracy in Complex Numbers. Recommended module: Bac Blanc 2024").

### 4.2 Color Palette (Dual Mode: Light & OLED Dark)

#### Light Mode: Restrained Editorial & Away-Kit Cobalt
| Token | Hex | Name / Usage |
|---|---|---|
| `primary` | `#12151B` | Deep Dark Charcoal (Primary visual weight, structural cards, headers) |
| `primaryContainer` | `#1E2430` | Elevated Charcoal Slate (Dark analytical containers) |
| `secondary` | `#1A56C4` | Club Africain Blue (Secondary visual weight: radar charts, curriculum tags) |
| `accent` | `#D80027` | Sparing Brand Red Accent (Action buttons, active tabs, urgency indicators) |
| `surface` | `#F8F9FA` | Off-white Gallery Linen (Calm, glare-free canvas) |
| `surfaceElevated` | `#FFFFFF` | Pure White (Floating analytical cards) |
| `textPrimary` | `#12151B` | Brand Dark Charcoal (Maximum optical acuity) |
| `textMuted` | `#64748B` | Cool Graphite Grey |
| `outline` | `#E5E7EB` | Hairline border (`1dp` stroke for crisp containment) |
| `reward` | `#D80027` | Sparing Red Distinction Ribbon |
| `feedbackSuccess` | `#059669` | Deep Academic Emerald |
| `feedbackError` | `#D80027` | Brand Red |

#### Dark Mode: OLED Studio Noir
| Token | Hex | Name / Usage |
|---|---|---|
| `primary` | `#F8FAFC` | Crisp Off-White |
| `primaryContainer` | `#1E2430` | Elevated Charcoal Plate |
| `secondary` | `#3B82F6` | Electric Blue Highlight |
| `accent` | `#D80027` | Sparing Crimson Accent (Active pill, CTA trigger) |
| `surface` | `#0B0D11` | Pitch Black OLED Canvas |
| `surfaceElevated` | `#12151B` | Dark Charcoal Elevation (Cards, sheets, dialogue panels) |
| `textPrimary` | `#F1F5F9` | High-contrast Pure White |
| `textMuted` | `#94A3B8` | Cool Steel Gray |
| `outline` | `#1E2430` | Dark hairline division stroke |

### 4.3 Type Scale
Refined, editorial neo-grotesque or humanist typography (e.g., Inter / Plus Jakarta Sans).

- **Heading Display:** `26sp` (Bold, LineHeight: `34sp`, LetterSpacing: `-0.6sp`)
- **Heading 1:** `20sp` (SemiBold, LineHeight: `26sp`)
- **Heading 2:** `16sp` (SemiBold, LineHeight: `22sp`)
- **Body Large:** `15sp` (Regular, LineHeight: `22sp`)
- **Body Regular:** `13sp` (Regular, LineHeight: `18sp`)
- **Label / Button:** `14sp` (Medium, LineHeight: `18sp`, Tracking: `+0.2sp`)
- **Data / Monospace:** `12sp` (JetBrains Mono / Roboto Mono for timers & formulas)

### 4.4 Component Style & Elevation
- **Corner Radius:** `10dp` (Buttons `10dp`, Cards `12dp`, Chips `6dp`).
- **Shadow Depth:** Architectural soft diffusion (`0 1px 3px rgba(18, 21, 27, 0.08)`) with subtle `1dp` border outlines.
- **Icon Style:** Minimalist stroke glyphs (`1.5dp` uniform stroke width).
- **Touch Target:** Ergonomic `48dp` target with precision haptics.

---

## 5. Age Band Matrix Summary Table

| Attribute | Band A (6–9) | Band B (10–13) | Band C (14–19) |
|---|---|---|---|
| **Audience** | Early Primary ("The Explorers") | Upper Primary / Middle ("The Adventurers") | High School / Bac ("The Scholars") |
| **Primary Hue** | Bold Red Accent (`#D80027`) | Red Action/Progress (`#D80027`) | Near-Black Visual Weight (`#12151B`) |
| **Secondary Hue** | Bold Blue Accent (`#1A56C4`) | Blue Competitive Accent (`#1A56C4`) | Blue Weight & Red Accent (`#1A56C4` / `#D80027`) |
| **Background** | Warm Vanilla (`#FFFDF9`) | Crisp Slate (`#F8FAFC`) | Gallery Linen (`#F8F9FA`) / OLED (`#0B0D11`) |
| **Corner Radius** | `28dp` (Pill & Chunky) | `14dp` (Modern Rounded) | `10dp` (Architectural / Sleek) |
| **Shadow / Bevel** | 3D Beveled Button (`#B70020` base) | Floating Red Shadow (`rgba(216,0,39,0.10)`) | Hairline + Charcoal Diffusion |
| **Iconography** | Chunky, Filled, Playful | Crisp Outlined + Blue Chip | Fine Line (1.5dp stroke), Minimal |
| **Copy Voice** | "Superstar! Tap the magic star!" | "Level Up! 5-day streak alive!" | "Module Complete. 92% mastery." |
| **Gamification** | Stars, stickers, sound effects | XP, ranks, avatars, shields | Mastery curves, stats, mock exams |
| **Dark Mode** | Light-only warmth | Supported (Game theme) | First-class citizen (OLED Dark default/toggle) |

