import { Platform, type ViewStyle } from 'react-native';

/**
 * Elevation tokens — warm charcoal shadow, mirrors the "Cream" design system.
 *
 *   card   — subtle lift for resting cards/rows
 *   soft   — a touch more presence (floating panels)
 *   button — pronounced lift for primary floating buttons / nav bar
 *
 * Shadow colour is warm espresso (#1A1612), never cool black, so lifts read
 * as warm depth on the cream canvas.
 */
const INK = '#1A1612';

export const shadows = {
  none: {} as ViewStyle,

  card: {
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  } as ViewStyle,

  soft: {
    shadowColor: INK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 4,
  } as ViewStyle,

  button: {
    shadowColor: INK,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: Platform.OS === 'ios' ? 0.22 : 0.26,
    shadowRadius: 24,
    elevation: 12,
  } as ViewStyle,
} as const;
