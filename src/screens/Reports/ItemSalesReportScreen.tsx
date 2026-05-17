import React, { useState, useMemo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
import { useItemReport } from '@/queries/reports';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { DateRangePicker, ReportTable, PaginationBar } from '@/components/shared';

export function ItemSalesReportScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ReportsStackParamList>>();
  const { outletId } = useOutlet();
  const dateRange = useAppStore((s) => s.reportsDateRange);
  const setDateRange = useAppStore((s) => s.setReportsDateRange);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useItemReport(outletId, dateRange.from, dateRange.to, page);

  // API returns ReportResponse<T> — the .data field holds the array
  const columns = useMemo(
    () => ['Item Name', 'Qty', 'Gross', 'Discount', 'Tax', 'Total Sales'],
    [],
  );

  const rows = useMemo(
    () =>
      (data?.data ?? []).map((row: any) => [
        row.itemName ?? '-',
        row.quantity ?? row.itemCount ?? 0,
        row.grossAmount ?? row.gross ?? 0,
        row.discount ?? 0,
        row.gst ?? row.tax ?? 0,
        row.totalSales ?? row.amount ?? row.total ?? 0,
      ]),
    [data],
  );

  const handleDateChange = useCallback(
    (r: any) => { setDateRange(r); setPage(1); },
    [setDateRange],
  );

  return (
    <ScreenWrapper>
      <TopBar title="Item Sales Report" showBack onBack={() => navigation.goBack()} />
      <DateRangePicker value={dateRange} onChange={handleDateChange} outletId={outletId} />
      <ReportTable
        columns={columns}
        rows={rows}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        downloadReportId="item"
        outletId={outletId}
        from={dateRange.from}
        to={dateRange.to}
      />
      {data?.pagination && (
        <PaginationBar pagination={data.pagination} onPageChange={setPage} />
      )}
    </ScreenWrapper>
  );
}
