import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { AppButton } from '@/components/primitives';

interface ErrorStateProps {
  title?: string;
  subtitle?: string;
  onRetry?: () => void;
}

export const ErrorState = React.memo(function ErrorState({
  title = 'System Sync Failed',
  subtitle = 'We could not fetch the latest data. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
      <Icon name="alert-circle" size={48} color="#EF4444" />
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#374151', marginTop: 16 }}>{title}</Text>
      <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 6, textAlign: 'center' }}>{subtitle}</Text>
      {onRetry && (
        <View style={{ marginTop: 20 }}>
          <AppButton label="Retry" onPress={onRetry} variant="secondary" />
        </View>
      )}
    </View>
  );
});
