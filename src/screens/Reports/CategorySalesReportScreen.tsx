import React, { useMemo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
import { useCategoryReport } from '@/queries/reports';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { DateRangePicker, ReportTable, ReportSummary } from '@/components/shared';

export function CategorySalesReportScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ReportsStackParamList>>();
  const { outletId } = useOutlet();
  const dateRange = useAppStore((s) => s.reportsDateRange);
  const setDateRange = useAppStore((s) => s.setReportsDateRange);
  const { data, isLoading, isError, refetch } = useCategoryReport(outletId, dateRange.from, dateRange.to);

  const columns = useMemo(
    () => ['Category', 'Count', 'Qty', 'Gross', 'Discount', 'Tax', 'Total', 'Contribution%'],
    [],
  );

  const rows = useMemo(
    () =>
      (data?.data ?? []).map((row: any) => [
        row.category ?? '-',
        row.count ?? 0,
        row.quantity ?? 0,
        row.gross ?? 0,
        row.discount ?? 0,
        row.tax ?? 0,
        row.total ?? 0,
        row.contributionPercent ?? row.contribution ?? 0,
      ]),
    [data],
  );

  const handleDateChange = useCallback((r: any) => setDateRange(r), [setDateRange]);

  return (
    <ScreenWrapper scrollable refreshControl onRefresh={refetch}>
      <TopBar title="Category Sales Report" showBack onBack={() => navigation.goBack()} />
      <DateRangePicker value={dateRange} onChange={handleDateChange} outletId={outletId} />
      <ReportSummary
        data={data?.data}
        isLoading={isLoading}
        metrics={[
          { label: 'Categories', count: true, icon: 'grid' },
          { label: 'Qty Sold', fields: ['quantity'], format: 'number', icon: 'package' },
          { label: 'Gross', fields: ['gross', 'grossAmount'], format: 'currency', icon: 'dollar-sign', tone: 'success' },
          { label: 'Discount', fields: ['discount'], format: 'currency', icon: 'percent', tone: 'danger' },
          { label: 'Tax', fields: ['tax', 'gst'], format: 'currency', icon: 'briefcase' },
          { label: 'Net Total', fields: ['total'], format: 'currency', icon: 'trending-up', tone: 'success' },
        ]}
        chart={{ title: 'Top categories', labelFields: ['category'], valueFields: ['total'], format: 'currency' }}
      />
      <ReportTable columns={columns} rows={rows} isLoading={isLoading} isError={isError} onRetry={refetch} downloadReportId="category" outletId={outletId} from={dateRange.from} to={dateRange.to} />
    </ScreenWrapper>
  );
}
