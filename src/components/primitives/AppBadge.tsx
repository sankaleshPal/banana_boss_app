import React from 'react';
import { View, Text } from 'react-native';

interface AppBadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

const variantStyles: Record<string, { bg: string; text: string }> = {
  success: { bg: 'rgba(16,185,129,0.15)', text: '#059669' },
  warning: { bg: 'rgba(245,158,11,0.15)', text: '#D97706' },
  error: { bg: 'rgba(239,68,68,0.15)', text: '#DC2626' },
  info: { bg: 'rgba(59,130,246,0.15)', text: '#2563EB' },
  neutral: { bg: 'rgba(156,163,175,0.15)', text: '#4B5563' },
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
        paddingHorizontal: size === 'sm' ? 6 : 10,
        paddingVertical: size === 'sm' ? 2 : 4,
        borderRadius: 999,
        alignSelf: 'flex-start',
      }}
    >
      <Text
        style={{
          color: s.text,
          fontSize: size === 'sm' ? 10 : 12,
          fontWeight: '700',
        }}
      >
        {label}
      </Text>
    </View>
  );
});
