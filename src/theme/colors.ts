/**
 * Banana Boss — "Cream" design system.
 *
 * One source of truth for colour. Screens should import from here instead of
 * hardcoding hex, so the app reads as one calm, consistent surface rather than
 * a mix of warm-cream and cool-slate tones.
 *
 * Palette intent:
 *   - Warm cream backgrounds (not cool slate/white)
 *   - Charcoal text (not blue-black)
 *   - Stone/taupe borders + muted text
 *   - A single yellow accent for primary/brand moments
 */
export const colors = {
  // Brand / accent
  primary: '#FDE047', // banana yellow — accent, active states, avatar
  primaryDark: '#1A1A1A', // charcoal — text on cream, dark headers
  onPrimary: '#111827', // text/icon placed on top of the yellow accent

  // Semantic
  success: '#16A34A',
  warning: '#D97706',
  danger: '#EF4444',
  info: '#0284C7',

  // Surfaces (cream system)
  surface: {
    canvas: '#FAF9F6', // app background — the cream
    card: '#FFFFFF', // cards / rows sit on the cream
    raised: '#F5F3EF', // subtle raised fill (chips, inputs)
    border: '#EAE8E2', // warm stone hairline border
    borderSoft: 'rgba(0,0,0,0.06)',
    // Back-compat aliases (older screens referenced these names)
    white: '#FFFFFF',
    base: '#FAF9F6',
    base200: '#F5F3EF',
  },

  // Text (charcoal + stone)
  text: {
    base: '#1A1A1A', // primary text
    secondary: '#44403C', // stone-700 — secondary copy
    muted: '#78716C', // stone-500 — labels, captions
    faint: '#A8A29E', // stone-400 — disabled / inactive
    white: '#FFFFFF',
    onAccent: '#111827',
  },

  // Soft tinted fills for report/category icon tiles (kept muted, not neon)
  tint: {
    sky: { bg: '#E0F2FE', fg: '#0284C7' },
    rose: { bg: '#FFE4E6', fg: '#E11D48' },
    violet: { bg: '#F3E8FF', fg: '#9333EA' },
    amber: { bg: '#FEF3C7', fg: '#D97706' },
    green: { bg: '#DCFCE7', fg: '#16A34A' },
  },

  badge: {
    paid: { bg: 'rgba(22,163,74,0.12)', text: '#15803D' },
    pending: { bg: 'rgba(217,119,6,0.14)', text: '#B45309' },
    veg: { bg: 'rgba(22,163,74,0.1)', text: '#15803D' },
    nonVeg: { bg: 'rgba(239,68,68,0.1)', text: '#DC2626' },
    vegan: { bg: 'rgba(217,119,6,0.1)', text: '#B45309' },
  },
} as const;
