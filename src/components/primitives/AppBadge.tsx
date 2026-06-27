import React from 'react';
import { View, Text } from 'react-native';
import { colors, fonts, radii } from '@/theme';

interface AppBadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

const variantStyles: Record<string, { bg: string; text: string }> = {
  success: { bg: colors.badge.paid.bg, text: colors.badge.paid.text },
  warning: { bg: colors.badge.pending.bg, text: colors.badge.pending.text },
  error: { bg: 'rgba(239,68,68,0.12)', text: '#DC2626' },
  info: { bg: 'rgba(2,132,199,0.12)', text: '#0284C7' },
  neutral: { bg: colors.surface.raised, text: colors.text.muted },
};

export const AppBadge = React.memo(function AppBadge({
  label,
  variant = 'neutral',
  size = 'md',
}: AppBadgeProps) {
  const s = variantStyles[variant];
  return (
    <View
      style={{
        backgroundColor: s.bg,
        paddingHorizontal: size === 'sm' ? 7 : 10,
        paddingVertical: size === 'sm' ? 2 : 4,
        borderRadius: radii.full,
        alignSelf: 'flex-start',
      }}
    >
      <Text
        style={{
          color: s.text,
          fontSize: size === 'sm' ? 10 : 12,
          fontFamily: fonts.bold,
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
    </View>
  );
});
