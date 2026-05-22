import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import type { AppTabsParamList } from '@/types/navigation';
import { ReportsStack } from './ReportsStack';
import { BillingStack } from './BillingStack';
import { fonts } from '@/theme';

const Tab = createBottomTabNavigator<AppTabsParamList>();

const INACTIVE = '#9CA3AF';

export function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, focused, size }) => {
          let iconName: string;
          switch (route.name) {
            case 'ReportsTab':   iconName = 'bar-chart-2'; break;
            case 'BillingTab':   iconName = 'credit-card'; break;
            default:             iconName = 'circle';
          }
          return <Icon name={iconName} size={size - 2} color={color} />;
        },
        tabBarActiveTintColor: '#1A1A1A',
        tabBarInactiveTintColor: '#A8A29E',
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: fonts.medium,
          fontWeight: '600',
          marginTop: -2,
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          height: 68,
          paddingBottom: Platform.OS === 'ios' ? 4 : 8,
          paddingTop: 8,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: '#EAE8E2',
          shadowColor: '#1A1A1A',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
          elevation: 6,
        },
      })}
    >
      <Tab.Screen name="ReportsTab"  component={ReportsStack}  options={{ tabBarLabel: 'Reports' }} />
      <Tab.Screen name="BillingTab"  component={BillingStack}  options={{ tabBarLabel: 'Billing' }} />
    </Tab.Navigator>
  );
}

