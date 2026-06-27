import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '@/theme';

interface AppLoaderProps {
  visible: boolean;
  fullScreen?: boolean;
  message?: string;
}

export const AppLoader = React.memo(function AppLoader({
  visible,
  fullScreen,
  message,
}: AppLoaderProps) {
  if (!visible) return null;

  const content = (
    <View style={{ alignItems: 'center' }}>
      <ActivityIndicator size="large" color={colors.primaryDark} />
      {message && (
        <Text style={{ marginTop: 12, fontSize: 14, fontFamily: fonts.medium, color: colors.text.secondary }}>
          {message}
        </Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(250,249,246,0.9)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 50,
        }}
      >
        {content}
      </View>
    );
  }

  return content;
});
