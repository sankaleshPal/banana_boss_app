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
  default: { bg: '#F5F3EF', icon: '#78716C', text: '#1A1A1A' },
  success: { bg: '#DCFCE7', icon: '#16A34A', text: '#16A34A' },
  danger: { bg: '#FFE4E6', icon: '#E11D48', text: '#E11D48' },
  muted: { bg: '#F5F3EF', icon: '#78716C', text: '#78716C' },
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
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        flex: 1,
        minWidth: 146,
        borderWidth: 1,
        borderColor: '#EAE8E2',
        shadowColor: '#1A1A1A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 1,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 11,
            backgroundColor: t.bg,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
          }}
        >
          <Icon name={icon} size={18} color={t.icon} />
        </View>
        <Text style={{ fontFamily: fonts.bold, fontSize: 11, fontWeight: '700', color: '#78716C', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {title}
        </Text>
      </View>
      <Text style={{ fontFamily: fonts.bold, fontSize: 22, fontWeight: '900', color: '#1A1A1A' }}>{value}</Text>
      {subtitle && <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: '#78716C', marginTop: 6, fontWeight: '500' }}>{subtitle}</Text>}
    </TouchableOpacity>
  );
});
