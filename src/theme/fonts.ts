export const fonts = {
  regular: 'Ubuntu_400Regular',
  medium: 'Ubuntu_500Medium',
  bold: 'Ubuntu_700Bold',
} as const;

export function ubuntuFontForWeight(weight?: string | number) {
  const numeric = typeof weight === 'number' ? weight : Number(weight || 400);

  if (numeric >= 700) return fonts.bold;
  if (numeric >= 500) return fonts.medium;
  return fonts.regular;
}
