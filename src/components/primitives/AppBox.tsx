import React from 'react';
import { View, type ViewProps } from 'react-native';

export const AppBox = React.memo(function AppBox({ style, ...props }: ViewProps) {
  return <View style={style} {...props} />;
});
