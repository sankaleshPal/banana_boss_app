import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/stores/appStore';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';
import { OutletAdminStack } from './OutletAdminStack';

export function RootNavigator() {
  const { isAuthenticated, isAdmin } = useAuth();
  const adminInOutlet = useAppStore((s) => s.adminInOutlet);

  // Guests → login.
  // Admin (email) on the universal view → all-outlets experience.
  // Admin who drilled into an outlet, and all staff → the full tabbed app
  // (mirrors banana_boss web: tapping an outlet enters the normal dashboard).
  const mode = !isAuthenticated
    ? 'guest'
    : isAdmin && !adminInOutlet
      ? 'admin'
      : 'app';

  // key forces a full remount when the mode flips so stale nav state is cleared.
  return (
    <NavigationContainer key={mode}>
      {mode === 'guest' ? (
        <AuthStack />
      ) : mode === 'admin' ? (
        <OutletAdminStack />
      ) : (
        <AppTabs />
      )}
    </NavigationContainer>
  );
}
