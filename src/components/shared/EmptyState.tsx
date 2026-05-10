import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { AppButton } from '@/components/primitives';

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
      <Icon name={icon} size={48} color="#D1D5DB" />
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#374151', marginTop: 16 }}>{title}</Text>
      {subtitle && (
        <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 6, textAlign: 'center' }}>{subtitle}</Text>
      )}
      {action && (
        <View style={{ marginTop: 20 }}>
          <AppButton label={action.label} onPress={action.onPress} variant="secondary" />
        </View>
      )}
    </View>
  );
});
