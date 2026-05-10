import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
import { useAreaItemReport } from '@/queries/reports';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { DateRangePicker, ReportTable } from '@/components/shared';

export function AreaItemReportScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ReportsStackParamList>>();
  const { outletId } = useOutlet();
  const dateRange = useAppStore((s) => s.reportsDateRange);
  const setDateRange = useAppStore((s) => s.setReportsDateRange);
  const { data, isLoading, isError, refetch } = useAreaItemReport(outletId, dateRange.from, dateRange.to);

  const columns = ['Item', 'Variant', 'Addon', 'Category', 'Area', 'Qty', 'Gross', 'Tax', 'Total'];
  const rows = (data?.data || []).map((row: any) => [
    row.itemName,
    row.variantName || '-',
    row.addonName || '-',
    row.categoryName || '-',
    row.areaName || '-',
    row.quantity,
    row.gross,
    row.tax,
    row.total,
  ]);

  return (
    <ScreenWrapper>
      <TopBar title="Area-Item Sales" showBack onBack={() => navigation.goBack()} />
      <DateRangePicker value={dateRange} onChange={setDateRange} />
      <ReportTable columns={columns} rows={rows} isLoading={isLoading} isError={isError} onRetry={refetch} />
    </ScreenWrapper>
  );
}
