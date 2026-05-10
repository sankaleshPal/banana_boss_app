import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/types/navigation';
import { SettingsOverviewScreen } from '@/screens/Settings/SettingsOverviewScreen';
import { OutletSelectorScreen } from '@/screens/Settings/OutletSelectorScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SettingsOverview" component={SettingsOverviewScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="OutletSelector" component={OutletSelectorScreen} options={{ title: 'Select Outlet' }} />
    </Stack.Navigator>
  );
}
