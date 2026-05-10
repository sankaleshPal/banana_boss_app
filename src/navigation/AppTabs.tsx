import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import type { AppTabsParamList } from '@/types/navigation';
import { ReportsStack } from './ReportsStack';
import { BillingStack } from './BillingStack';
import { SettingsStack } from './SettingsStack';

const Tab = createBottomTabNavigator<AppTabsParamList>();

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: string;
          switch (route.name) {
            case 'ReportsTab':
              iconName = 'bar-chart-2';
              break;
            case 'BillingTab':
              iconName = 'credit-card';
              break;
            case 'SettingsTab':
              iconName = 'settings';
              break;
            default:
              iconName = 'circle';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#111827',
        tabBarInactiveTintColor: '#9CA3AF',
      })}
    >
      <Tab.Screen name="ReportsTab" component={ReportsStack} options={{ tabBarLabel: 'Reports' }} />
      <Tab.Screen name="BillingTab" component={BillingStack} options={{ tabBarLabel: 'Billing' }} />
      <Tab.Screen name="SettingsTab" component={SettingsStack} options={{ tabBarLabel: 'Settings' }} />
    </Tab.Navigator>
  );
}
