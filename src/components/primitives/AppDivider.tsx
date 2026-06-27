import React from 'react';
import { View } from 'react-native';
import { colors } from '@/theme';

export const AppDivider = React.memo(function AppDivider() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: colors.surface.borderSoft,
        marginVertical: 12,
      }}
    />
  );
});
