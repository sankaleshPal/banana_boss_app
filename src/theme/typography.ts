import { fonts } from './fonts';

/**
 * Type scale — mirrors the HiPalz "Cream" design system, expressed in Poppins.
 * Pair `fontFamily` (controls glyph weight) with `fontSize`/`letterSpacing`.
 */
export const typography = {
  h1: { fontSize: 28, fontFamily: fonts.extrabold, fontWeight: '800' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontFamily: fonts.bold, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontFamily: fonts.bold, fontWeight: '700' as const },
  body: { fontSize: 14, fontFamily: fonts.regular, fontWeight: '400' as const },
  bodyMedium: { fontSize: 14, fontFamily: fonts.semibold, fontWeight: '600' as const },
  caption: { fontSize: 11, fontFamily: fonts.bold, fontWeight: '700' as const, letterSpacing: 0.5 },
  label: { fontSize: 12, fontFamily: fonts.semibold, fontWeight: '600' as const },
  number: { fontSize: 24, fontFamily: fonts.extrabold, fontWeight: '800' as const },
};
