import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { BillingStackParamList } from '@/types/navigation';
import { BillingOverviewScreen } from '@/screens/Billing/BillingOverviewScreen';
import { SalesDashboardScreen } from '@/screens/Billing/SalesDashboardScreen';
import { BillsListScreen } from '@/screens/Billing/BillsListScreen';
import { BillDetailScreen } from '@/screens/Billing/BillDetailScreen';
import { PaymentModesScreen } from '@/screens/Billing/PaymentModesScreen';
import { DuesScreen } from '@/screens/Billing/DuesScreen';
import { NpcScreen } from '@/screens/Billing/NpcScreen';

const Stack = createNativeStackNavigator<BillingStackParamList>();

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: '#F3F4F6' },
  animation: 'slide_from_right' as const,
};

export function BillingStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="BillingOverview" component={BillingOverviewScreen} />
      <Stack.Screen name="SalesDashboard" component={SalesDashboardScreen} />
      <Stack.Screen name="BillsList" component={BillsListScreen} />
      <Stack.Screen name="BillDetail" component={BillDetailScreen} />
      <Stack.Screen name="PaymentModes" component={PaymentModesScreen} />
      <Stack.Screen name="Dues" component={DuesScreen} />
      <Stack.Screen name="Npc" component={NpcScreen} />
    </Stack.Navigator>
  );
}
