import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';

export function RootNavigator() {
  const { isAuthenticated } = useAuth();

  // key forces NavigationContainer (and its child navigators) to fully remount
  // when auth state flips — guarantees stale navigation state is cleared on logout.
  return (
    <NavigationContainer key={isAuthenticated ? 'auth' : 'guest'}>
      {isAuthenticated ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
