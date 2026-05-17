import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import type { AppTabsParamList } from '@/types/navigation';
import { ReportsStack } from './ReportsStack';
import { BillingStack } from './BillingStack';
import { SettingsStack } from './SettingsStack';

const Tab = createBottomTabNavigator<AppTabsParamList>();

const YELLOW = '#F5C518';
const INACTIVE = '#9CA3AF';

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, focused }) => {
          let iconName: string;
          switch (route.name) {
            case 'ReportsTab':   iconName = 'bar-chart-2'; break;
            case 'BillingTab':   iconName = 'credit-card'; break;
            case 'SettingsTab':  iconName = 'settings';    break;
            default:             iconName = 'circle';
          }
          return <Icon name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: '#111827',
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.07)',
          height: Platform.OS === 'ios' ? 84 : 62,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarItemStyle: {
          gap: 2,
        },
      })}
    >
      <Tab.Screen name="ReportsTab"  component={ReportsStack}  options={{ tabBarLabel: 'Reports' }} />
      <Tab.Screen name="BillingTab"  component={BillingStack}  options={{ tabBarLabel: 'Billing' }} />
      <Tab.Screen name="SettingsTab" component={SettingsStack} options={{ tabBarLabel: 'Settings' }} />
    </Tab.Navigator>
  );
}
