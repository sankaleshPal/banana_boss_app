import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
import { useItemVariantReport } from '@/queries/reports';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { DateRangePicker, ReportTable } from '@/components/shared';

export function ItemVariantReportScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ReportsStackParamList>>();
  const { outletId } = useOutlet();
  const dateRange = useAppStore((s) => s.reportsDateRange);
  const setDateRange = useAppStore((s) => s.setReportsDateRange);
  const { data, isLoading, isError, refetch } = useItemVariantReport(outletId, dateRange.from, dateRange.to);

  const columns = ['Item', 'Variant', 'Addons', 'Qty', 'Gross', 'Tax', 'Total'];
  const rows = (data?.data || []).map((row: any) => [
    row.itemName,
    row.variantName || '-',
    row.addonNames || '-',
    row.quantity,
    row.gross,
    row.tax,
    row.total,
  ]);

  return (
    <ScreenWrapper>
      <TopBar title="Item Variant Report" showBack onBack={() => navigation.goBack()} />
      <DateRangePicker value={dateRange} onChange={setDateRange} />
      <ReportTable columns={columns} rows={rows} isLoading={isLoading} isError={isError} onRetry={refetch} />
    </ScreenWrapper>
  );
}
