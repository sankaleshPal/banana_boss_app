import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { OutletAdminStackParamList } from '@/types/navigation';
import { colors, fonts } from '@/theme';
import { AllOutletsScreen } from '@/screens/OutletAdmin/AllOutletsScreen';

const Stack = createNativeStackNavigator<OutletAdminStackParamList>();

export function OutletAdminStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface.canvas },
        headerTitleStyle: { fontFamily: fonts.bold, color: colors.text.base },
        headerShadowVisible: false,
        headerTintColor: colors.text.base,
      }}
    >
      <Stack.Screen
        name="AllOutlets"
        component={AllOutletsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
