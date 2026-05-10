import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

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
      <ActivityIndicator size="large" color="#111827" />
      {message && (
        <Text style={{ marginTop: 12, fontSize: 14, color: '#374151' }}>{message}</Text>
      )}
    </View>
  );

  if (fullScreen) {
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(255,255,255,0.9)',
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

import { StyleSheet } from 'react-native';
