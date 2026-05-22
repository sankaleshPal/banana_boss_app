import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, type TouchableOpacityProps } from 'react-native';
import { fonts } from '@/theme';

interface AppButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const variantMap = {
  primary: { bg: '#1A1A1A', text: '#FFFFFF' },
  secondary: { bg: '#F5F3EF', text: '#1A1A1A' },
  ghost: { bg: 'transparent', text: '#1A1A1A' },
  danger: { bg: '#E05252', text: '#FFFFFF' },
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
          borderRadius: 14,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.45 : 1,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: '#EAE8E2',
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <Text style={{ fontFamily: fonts.bold, color: v.text, fontSize: s.font, fontWeight: '600', letterSpacing: 0.1 }}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
});

