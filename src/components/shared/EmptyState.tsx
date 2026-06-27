import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { AppButton } from '@/components/primitives';
import { colors, fonts } from '@/theme';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: string;
  action?: { label: string; onPress: () => void };
}

export const EmptyState = React.memo(function EmptyState({
  title,
  subtitle,
  icon = 'inbox',
  action,
}: EmptyStateProps) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
      <Icon name={icon} size={48} color={colors.text.faint} />
      <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: colors.text.secondary, marginTop: 16 }}>{title}</Text>
      {subtitle && (
        <Text style={{ fontSize: 13, fontFamily: fonts.regular, color: colors.text.muted, marginTop: 6, textAlign: 'center' }}>{subtitle}</Text>
      )}
      {action && (
        <View style={{ marginTop: 20 }}>
          <AppButton label={action.label} onPress={action.onPress} variant="secondary" />
        </View>
      )}
    </View>
  );
});
