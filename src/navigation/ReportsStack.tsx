import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/types/navigation';
import { ReportsOverviewScreen } from '@/screens/Reports/ReportsOverviewScreen';
import { NetSalesSummaryScreen } from '@/screens/Reports/NetSalesSummaryScreen';
import { BillWiseReportScreen } from '@/screens/Reports/BillWiseReportScreen';
import { ItemSalesReportScreen } from '@/screens/Reports/ItemSalesReportScreen';
import { CategorySalesReportScreen } from '@/screens/Reports/CategorySalesReportScreen';
import { ParentCategorySalesScreen } from '@/screens/Reports/ParentCategorySalesScreen';
import { AddonSalesReportScreen } from '@/screens/Reports/AddonSalesReportScreen';
import { ItemTypeReportScreen } from '@/screens/Reports/ItemTypeReportScreen';
import { ItemVariantReportScreen } from '@/screens/Reports/ItemVariantReportScreen';
import { AreaReportScreen } from '@/screens/Reports/AreaReportScreen';
import { AreaItemReportScreen } from '@/screens/Reports/AreaItemReportScreen';
import { DiscountReportScreen } from '@/screens/Reports/DiscountReportScreen';
import { ServiceChargeReportScreen } from '@/screens/Reports/ServiceChargeReportScreen';
import { TableReportScreen } from '@/screens/Reports/TableReportScreen';
import { DeletedKotReportScreen } from '@/screens/Reports/DeletedKotReportScreen';
import { TransferKotReportScreen } from '@/screens/Reports/TransferKotReportScreen';
import { TransferTableReportScreen } from '@/screens/Reports/TransferTableReportScreen';
import { OutstandingDuesScreen } from '@/screens/Reports/OutstandingDuesScreen';
import { OpenItemSalesScreen } from '@/screens/Reports/OpenItemSalesScreen';

const Stack = createNativeStackNavigator<ReportsStackParamList>();

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: '#F3F4F6' },
  animation: 'slide_from_right' as const,
};

export function ReportsStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="ReportsOverview" component={ReportsOverviewScreen} />
      <Stack.Screen name="NetSalesSummary" component={NetSalesSummaryScreen} />
      <Stack.Screen name="BillWiseReport" component={BillWiseReportScreen} />
      <Stack.Screen name="ItemSalesReport" component={ItemSalesReportScreen} />
      <Stack.Screen name="CategorySalesReport" component={CategorySalesReportScreen} />
      <Stack.Screen name="ParentCategoryReport" component={ParentCategorySalesScreen} />
      <Stack.Screen name="AddonSalesReport" component={AddonSalesReportScreen} />
      <Stack.Screen name="ItemTypeReport" component={ItemTypeReportScreen} />
      <Stack.Screen name="ItemVariantReport" component={ItemVariantReportScreen} />
      <Stack.Screen name="AreaReport" component={AreaReportScreen} />
      <Stack.Screen name="AreaItemReport" component={AreaItemReportScreen} />
      <Stack.Screen name="DiscountReport" component={DiscountReportScreen} />
      <Stack.Screen name="ServiceChargeReport" component={ServiceChargeReportScreen} />
      <Stack.Screen name="TableReport" component={TableReportScreen} />
      <Stack.Screen name="DeletedKotReport" component={DeletedKotReportScreen} />
      <Stack.Screen name="TransferKotReport" component={TransferKotReportScreen} />
      <Stack.Screen name="TransferTableReport" component={TransferTableReportScreen} />
      <Stack.Screen name="OutstandingDues" component={OutstandingDuesScreen} />
      <Stack.Screen name="OpenItemSales" component={OpenItemSalesScreen} />
    </Stack.Navigator>
  );
}
