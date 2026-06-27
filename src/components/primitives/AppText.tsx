import React from 'react';
import { Text, type TextProps } from 'react-native';
import { typography, fontForWeight, colors } from '@/theme';

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label' | 'number';
type Color = 'primary' | 'secondary' | 'muted' | 'error' | 'success' | 'white';
type Weight = 'regular' | 'medium' | 'semibold' | 'bold' | 'black';

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: Color;
  weight?: Weight;
}

const colorMap: Record<Color, string> = {
  primary: colors.text.base,
  secondary: colors.text.secondary,
  muted: colors.text.muted,
  error: colors.danger,
  success: colors.success,
  white: colors.text.white,
};

const weightMap: Record<Weight, string> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  black: '800',
};

export const AppText = React.memo(function AppText({
  variant = 'body',
  color = 'primary',
  weight,
  style,
  children,
  ...props
}: AppTextProps) {
  const t = typography[variant];
  const w = weight ? weightMap[weight] : t.fontWeight;

  return (
    <Text
      style={[
        {
          fontSize: t.fontSize,
          fontFamily: fontForWeight(w),
          letterSpacing: 'letterSpacing' in t ? t.letterSpacing : undefined,
          color: colorMap[color],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
});
