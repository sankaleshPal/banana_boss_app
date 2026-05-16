import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/queries/queryClient";
import { RootNavigator } from "@/navigation/RootNavigator";

// Inject Feather icon font on web so icons render correctly
function injectIconFont(family: string, url: string) {
  if (typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = `@font-face { font-family: '${family}'; src: url('${url}') format('truetype'); }`;
  document.head.appendChild(style);
}

async function loadIconFonts() {
  try {
    // Static require — Metro resolves this path at build time
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const featherFont = require("react-native-vector-icons/Fonts/Feather.ttf");
    injectIconFont("Feather", featherFont);
  } catch {
    // Non-fatal: icons fall back to empty sankalesh
  }
}

export default function App() {
  const [fontsReady, setFontsReady] = useState(Platform.OS !== "web");

  useEffect(() => {
    if (Platform.OS === "web") {
      loadIconFonts().finally(() => setFontsReady(true));
    }
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
