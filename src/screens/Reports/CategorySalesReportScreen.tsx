import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
import { useCategoryReport } from '@/queries/reports';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { DateRangePicker, ReportTable } from '@/components/shared';

export function CategorySalesReportScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ReportsStackParamList>>();
  const { outletId } = useOutlet();
  const dateRange = useAppStore((s) => s.reportsDateRange);
  const setDateRange = useAppStore((s) => s.setReportsDateRange);
  const { data, isLoading, isError, refetch } = useCategoryReport(outletId, dateRange.from, dateRange.to);

  const columns = ['Category', 'Count', 'Qty', 'Gross', 'Discount', 'Tax', 'Total', 'Contribution%'];
  const rows = (data?.data || []).map((row: any) => [
    row.category,
    row.count,
    row.quantity,
    row.gross,
    row.discount,
    row.tax,
    row.total,
    row.contributionPercent,
  ]);

  return (
    <ScreenWrapper>
      <TopBar title="Category Sales Report" showBack onBack={() => navigation.goBack()} />
      <DateRangePicker value={dateRange} onChange={setDateRange} />
      <ReportTable columns={columns} rows={rows} isLoading={isLoading} isError={isError} onRetry={refetch} />
    </ScreenWrapper>
  );
}
