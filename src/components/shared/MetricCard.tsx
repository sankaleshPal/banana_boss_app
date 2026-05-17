import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { fonts } from '@/theme';

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
  default: { bg: '#EEF2FF', icon: '#3730A3', text: '#0F172A' },
  success: { bg: '#DCFCE7', icon: '#047857', text: '#065F46' },
  danger: { bg: '#FFE4E6', icon: '#BE123C', text: '#9F1239' },
  muted: { bg: '#F1F5F9', icon: '#475569', text: '#334155' },
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
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 16,
        flex: 1,
        minWidth: 140,
        borderWidth: 1,
        borderColor: '#E5E7EB',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: t.bg,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
          }}
        >
          <Icon name={icon} size={16} color={t.icon} />
        </View>
        <Text style={{ fontFamily: fonts.bold, fontSize: 11, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
          {title}
        </Text>
      </View>
      <Text style={{ fontFamily: fonts.bold, fontSize: 22, fontWeight: '700', color: t.text }}>{value}</Text>
      {subtitle && <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: '#64748B', marginTop: 4 }}>{subtitle}</Text>}
    </TouchableOpacity>
  );
});
