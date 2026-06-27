import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors, fonts, radii, shadows } from '@/theme';

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

const toneMap: Record<string, { bg: string; icon: string }> = {
  default: { bg: colors.surface.raised, icon: colors.text.muted },
  success: { bg: colors.tint.green.bg, icon: colors.success },
  danger: { bg: colors.tint.rose.bg, icon: colors.danger },
  muted: { bg: colors.surface.raised, icon: colors.text.muted },
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
        backgroundColor: colors.surface.card,
        borderRadius: radii.card,
        padding: 18,
        flex: 1,
        minWidth: 146,
        borderWidth: 1,
        borderColor: colors.surface.border,
        ...shadows.card,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: radii.chip,
            backgroundColor: t.bg,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
          }}
        >
          <Icon name={icon} size={18} color={t.icon} />
        </View>
        <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 0.5, flex: 1 }} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <Text style={{ fontFamily: fonts.extrabold, fontSize: 22, color: colors.text.base }}>{value}</Text>
      {subtitle && <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: colors.text.muted, marginTop: 6 }}>{subtitle}</Text>}
    </TouchableOpacity>
  );
});
