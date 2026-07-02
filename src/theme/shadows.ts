import { Platform, type ViewStyle } from 'react-native';

/**
 * Elevation tokens — "Midnight" (CRED-inspired) dark theme.
 *
 * On a near-black canvas, depth reads through deep black drop-shadows plus the
 * hairline borders defined in colours. Shadow colour is pure black so lifts
 * feel like true elevation against the dark surface.
 *
 *   card   — subtle lift for resting cards/rows
 *   soft   — floating panels / sheets
 *   button — pronounced lift for primary floating buttons / nav bar
 *   glow   — accent glow for hero/primary elements (CRED signature)
 */
const BLACK = '#000000';

export const shadows = {
  none: {} as ViewStyle,

  card: {
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 3,
  } as ViewStyle,

  soft: {
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 6,
  } as ViewStyle,

  button: {
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: Platform.OS === 'ios' ? 0.5 : 0.55,
    shadowRadius: 28,
    elevation: 14,
  } as ViewStyle,

  // Accent glow — for the yellow primary button / hero moments.
  glow: {
    shadowColor: '#FFE45C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  } as ViewStyle,
} as const;
