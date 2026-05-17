import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/types/navigation';
import { SettingsOverviewScreen } from '@/screens/Settings/SettingsOverviewScreen';
import { OutletSelectorScreen } from '@/screens/Settings/OutletSelectorScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: '#F3F4F6' },
  animation: 'slide_from_right' as const,
};

export function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="SettingsOverview" component={SettingsOverviewScreen} />
      <Stack.Screen name="OutletSelector" component={OutletSelectorScreen} />
    </Stack.Navigator>
  );
}
