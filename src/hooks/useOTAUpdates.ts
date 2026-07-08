import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import * as Updates from 'expo-updates';

/**
 * Over-the-air (EAS Update) auto-updater.
 *
 * Checks the update server on app launch AND every time the app returns to the
 * foreground. If a new OTA update has been published for this runtime version,
 * it downloads it and reloads the app automatically so the latest JS/asset
 * bundle is applied without the user reinstalling from the store.
 *
 * No-op in development / Expo Go (Updates.isEnabled is false there) — OTA only
 * works in a built app (dev-client, preview, or production).
 */
export function useOTAUpdates() {
  const busy = useRef(false);

  useEffect(() => {
    const checkAndApply = async () => {
      // Skip in dev and when updates aren't enabled (Expo Go, web).
      if (__DEV__ || !Updates.isEnabled) return;
      if (busy.current) return;
      busy.current = true;
      try {
        const check = await Updates.checkForUpdateAsync();
        if (check.isAvailable) {
          await Updates.fetchUpdateAsync();
          // Relaunch with the freshly downloaded bundle.
          await Updates.reloadAsync();
        }
      } catch {
        // Offline or update server unreachable — keep running the current
        // bundle; we'll try again on the next foreground.
      } finally {
        busy.current = false;
      }
    };

    checkAndApply();

    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') checkAndApply();
    });
    return () => sub.remove();
  }, []);
}
