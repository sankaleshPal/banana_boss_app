import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, type TouchableOpacityProps } from 'react-native';

interface AppButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const variantMap = {
  primary: { bg: '#111827', text: '#FFFFFF' },
  secondary: { bg: '#F3F4F6', text: '#111827' },
  ghost: { bg: 'transparent', text: '#111827' },
  danger: { bg: '#EF4444', text: '#FFFFFF' },
};

const sizeMap = {
  sm: { py: 8, px: 12, font: 12 },
  md: { py: 12, px: 16, font: 14 },
  lg: { py: 16, px: 24, font: 16 },
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
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[
        {
          backgroundColor: v.bg,
          paddingVertical: s.py,
          paddingHorizontal: s.px,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={v.text} />
      ) : (
        <Text style={{ color: v.text, fontSize: s.font, fontWeight: '700' }}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
});
