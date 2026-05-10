import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/queries/queryClient';
import { RootNavigator } from '@/navigation/RootNavigator';

// Load react-native-vector-icons fonts on web so icons render correctly
async function loadIconFonts() {
  if (Platform.OS !== 'web') return;
  const iconFontNames = ['Feather'];
  await Promise.all(
    iconFontNames.map(async (name) => {
      try {
        // react-native-vector-icons ships pre-built font files
        const fontModule = require(`react-native-vector-icons/Fonts/${name}.ttf`);
        const style = document.createElement('style');
        style.textContent = `
          @font-face {
            font-family: '${name}';
            src: url('${fontModule}') format('truetype');
          }
        `;
        document.head.appendChild(style);
      } catch {
        // Font load failure is non-fatal; icons will fall back to □
      }
    }),
  );
}

export default function App() {
  const [fontsReady, setFontsReady] = useState(Platform.OS !== 'web');

  useEffect(() => {
    loadIconFonts().finally(() => setFontsReady(true));
  }, []);

  if (!fontsReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <RootNavigator />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
