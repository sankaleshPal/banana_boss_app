import React from 'react';
import { View } from 'react-native';

export const AppDivider = React.memo(function AppDivider() {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.06)',
        marginVertical: 12,
      }}
    />
  );
});
