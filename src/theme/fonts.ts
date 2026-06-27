/**
 * Typeface — Poppins (the HiPalz brand typeface).
 *
 * Weights loaded in App.tsx: 400 / 500 / 600 / 700 / 800.
 * Components reference these named families rather than relying on
 * `fontWeight`, so glyph weight is consistent across web + native.
 */
export const fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  extrabold: 'Poppins_800ExtraBold',
} as const;

/** Pick the closest loaded Poppins family for a numeric/string fontWeight. */
export function fontForWeight(weight?: string | number) {
  const numeric = typeof weight === 'number' ? weight : Number(weight || 400);

  if (numeric >= 800) return fonts.extrabold;
  if (numeric >= 700) return fonts.bold;
  if (numeric >= 600) return fonts.semibold;
  if (numeric >= 500) return fonts.medium;
  return fonts.regular;
}
