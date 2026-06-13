import React, { useMemo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
import { useTableReport } from '@/queries/reports';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { DateRangePicker, ReportTable, ReportSummary } from '@/components/shared';

export function TableReportScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ReportsStackParamList>>();
  const { outletId } = useOutlet();
  const dateRange = useAppStore((s) => s.reportsDateRange);
  const setDateRange = useAppStore((s) => s.setReportsDateRange);
  const { data, isLoading, isError, refetch } = useTableReport(outletId, dateRange.from, dateRange.to);

  const columns = useMemo(() => ['Table Name', 'Bills', 'Qty', 'Gross', 'Tax', 'Total'], []);

  const rows = useMemo(
    () =>
      (data?.data ?? []).map((row: any) => [
        row.tableName ?? '-',
        row.billCount ?? 0,
        row.quantity ?? 0,
        row.gross ?? row.grossAmount ?? 0,
        row.tax ?? row.gst ?? 0,
        row.total ?? 0,
      ]),
    [data],
  );

  const handleDateChange = useCallback((r: any) => setDateRange(r), [setDateRange]);

  return (
    <ScreenWrapper scrollable refreshControl onRefresh={refetch}>
      <TopBar title="Table Report" showBack onBack={() => navigation.goBack()} />
      <DateRangePicker value={dateRange} onChange={handleDateChange} outletId={outletId} />
      <ReportSummary
        data={data?.data}
        isLoading={isLoading}
        metrics={[
          { label: 'Tables', count: true, icon: 'layout' },
          { label: 'Bills', fields: ['billCount'], format: 'number', icon: 'file-text' },
          { label: 'Qty Sold', fields: ['quantity'], format: 'number', icon: 'package' },
          { label: 'Gross', fields: ['gross', 'grossAmount'], format: 'currency', icon: 'dollar-sign', tone: 'success' },
          { label: 'Tax', fields: ['tax', 'gst'], format: 'currency', icon: 'briefcase' },
          { label: 'Net Total', fields: ['total'], format: 'currency', icon: 'trending-up', tone: 'success' },
        ]}
        chart={{ title: 'Top tables by sales', labelFields: ['tableName'], valueFields: ['total'], format: 'currency' }}
      />
      <ReportTable columns={columns} rows={rows} isLoading={isLoading} isError={isError} onRetry={refetch} downloadReportId="table" outletId={outletId} from={dateRange.from} to={dateRange.to} />
    </ScreenWrapper>
  );
}
