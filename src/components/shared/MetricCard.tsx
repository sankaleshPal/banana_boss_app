import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface BreakdownItem {
  label: string;
  value: number;
  direction?: 'positive' | 'negative' | 'neutral';
}

interface MetricCardProps {
  title: string;
  subtitle?: string;
  value: string;
  icon: string;
  tone?: 'default' | 'success' | 'danger' | 'muted';
  breakdown?: BreakdownItem[];
  onPress?: () => void;
}

const toneMap: Record<string, { bg: string; icon: string; text: string }> = {
  default: { bg: '#F3F4F6', icon: '#111827', text: '#111827' },
  success: { bg: 'rgba(16,185,129,0.12)', icon: '#059669', text: '#059669' },
  danger: { bg: 'rgba(239,68,68,0.12)', icon: '#DC2626', text: '#DC2626' },
  muted: { bg: 'rgba(156,163,175,0.12)', icon: '#6B7280', text: '#6B7280' },
};

export const MetricCard = React.memo(function MetricCard({
  title,
  subtitle,
  value,
  icon,
  tone = 'default',
  onPress,
}: MetricCardProps) {
  const t = toneMap[tone];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        backgroundColor: t.bg,
        borderRadius: 14,
        padding: 16,
        flex: 1,
        minWidth: 140,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: 'rgba(255,255,255,0.6)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
          }}
        >
          <Icon name={icon} size={16} color={t.icon} />
        </View>
        <Text style={{ fontSize: 11, fontWeight: '700', color: t.text, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {title}
        </Text>
      </View>
      <Text style={{ fontSize: 22, fontWeight: '900', color: t.text }}>{value}</Text>
      {subtitle && <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 4 }}>{subtitle}</Text>}
    </TouchableOpacity>
  );
});
