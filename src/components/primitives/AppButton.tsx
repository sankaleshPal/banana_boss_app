import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, type TouchableOpacityProps } from 'react-native';
import { colors, fonts, radii } from '@/theme';

interface AppButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const variantMap = {
  primary: { bg: colors.primaryDark, text: colors.text.white, border: 'transparent' },
  secondary: { bg: colors.surface.raised, text: colors.text.base, border: colors.surface.border },
  ghost: { bg: 'transparent', text: colors.text.base, border: 'transparent' },
  danger: { bg: colors.danger, text: colors.text.white, border: 'transparent' },
};

const sizeMap = {
  sm: { py: 10, px: 16, font: 13 },
  md: { py: 14, px: 22, font: 15 },
  lg: { py: 18, px: 28, font: 17 },
};

export const AppButton = React.memo(function AppButton({
  label,
  variant = 'primary',
  loading,
  size = 'md',
  disabled,
  style,
  ...props
}: AppButtonProps) {
  const v = variantMap[variant];
  const s = sizeMap[size];

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={disabled || loading}
      style={[
        {
          backgroundColor: v.bg,
          paddingVertical: s.py,
          paddingHorizontal: s.px,
          borderRadius: radii.tile,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.45 : 1,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: v.border,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <Text style={{ fontFamily: fonts.bold, color: v.text, fontSize: s.font, letterSpacing: 0.1 }}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
});
