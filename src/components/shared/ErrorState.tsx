import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { AppButton } from '@/components/primitives';
import { colors, fonts } from '@/theme';

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
      <Icon name="alert-circle" size={48} color={colors.danger} />
      <Text style={{ fontSize: 16, fontFamily: fonts.bold, color: colors.text.secondary, marginTop: 16 }}>{title}</Text>
      <Text style={{ fontSize: 13, fontFamily: fonts.regular, color: colors.text.muted, marginTop: 6, textAlign: 'center' }}>{subtitle}</Text>
      {onRetry && (
        <View style={{ marginTop: 20 }}>
          <AppButton label="Retry" onPress={onRetry} variant="secondary" />
        </View>
      )}
    </View>
  );
});
