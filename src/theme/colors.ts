/**
 * Banana Boss — "Midnight" design system (CRED-inspired dark theme).
 *
 * One source of truth for colour. Screens import from here instead of
 * hardcoding hex, so the app reads as one deep, premium dark surface.
 *
 * Palette intent (CRED-style fintech):
 *   - Near-black canvas, softly elevated charcoal cards
 *   - Near-white text on dark, muted greys for secondary copy
 *   - Banana-yellow as the single vivid accent (pops on black)
 *   - Hairline translucent-white borders; depth from elevation, not lines
 *   - Semantic colours brightened so they read on dark surfaces
 *
 * Token NAMES are kept stable from the previous theme so every screen that
 * already consumes tokens adopts the dark look automatically.
 */
export const colors = {
  // Brand / accent
  primary: '#FFE45C', // vivid banana-yellow — accent, active states, avatar
  primaryDark: '#FFE45C', // drives loaders / active tint on dark (was dark text)
  onPrimary: '#0B0B0F', // near-black text/icon on top of the yellow accent
  gold: '#E6C77E', // soft gold — premium highlights on dark
  brass: '#D9B36A', // brass — gold text on dark surfaces

  // Semantic (brightened for dark)
  success: '#4ADE80',
  warning: '#FBBF24',
  danger: '#F87171',
  info: '#38BDF8',

  // Surfaces (Midnight system)
  surface: {
    canvas: '#0B0B0F', // app background — near-black
    card: '#16161C', // elevated cards / rows
    raised: '#1F1F27', // chips, inputs, subtle raised fill
    border: 'rgba(255,255,255,0.08)', // hairline border on dark
    borderSoft: 'rgba(255,255,255,0.05)',
    // Distinct elevated ("ink") surface — active chips / hero cards
    ink: '#23232C',
    inkRaised: '#2E2E38',
    inkBorder: 'rgba(255,255,255,0.10)',
    overlay: 'rgba(0,0,0,0.66)', // modal backdrop
    // Back-compat aliases (older screens used these as backgrounds) → dark now
    white: '#16161C',
    base: '#0B0B0F',
    base200: '#1F1F27',
  },

  // Text (light on dark)
  text: {
    base: '#F5F5F7', // primary text
    secondary: '#B4B4C0', // secondary copy
    muted: '#8A8A96', // labels, captions
    faint: '#5A5A66', // disabled / inactive
    white: '#FFFFFF',
    onAccent: '#0B0B0F', // text on the yellow accent
    onInk: '#F5F5F7', // primary text on elevated ink surfaces
    onInkMuted: '#8A8A96', // muted text on elevated ink surfaces
  },

  // Soft tinted fills for report/category icon tiles (translucent on dark)
  tint: {
    sky: { bg: 'rgba(56,189,248,0.14)', fg: '#7DD3FC' },
    rose: { bg: 'rgba(248,113,113,0.14)', fg: '#FCA5A5' },
    violet: { bg: 'rgba(167,139,250,0.16)', fg: '#C4B5FD' },
    amber: { bg: 'rgba(251,191,36,0.15)', fg: '#FCD34D' },
    green: { bg: 'rgba(74,222,128,0.14)', fg: '#86EFAC' },
    accent: { bg: 'rgba(255,228,92,0.14)', fg: '#FFE45C' },
  },

  badge: {
    paid: { bg: 'rgba(74,222,128,0.16)', text: '#86EFAC' },
    pending: { bg: 'rgba(251,191,36,0.16)', text: '#FCD34D' },
    veg: { bg: 'rgba(74,222,128,0.14)', text: '#86EFAC' },
    nonVeg: { bg: 'rgba(248,113,113,0.14)', text: '#FCA5A5' },
    vegan: { bg: 'rgba(251,191,36,0.14)', text: '#FCD34D' },
  },
} as const;
