import React, { useState, useMemo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
import { useBillWiseReport } from '@/queries/reports';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { DateRangePicker, ReportTable, PaginationBar } from '@/components/shared';

export function BillWiseReportScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ReportsStackParamList>>();
  const { outletId } = useOutlet();
  const dateRange = useAppStore((s) => s.reportsDateRange);
  const setDateRange = useAppStore((s) => s.setReportsDateRange);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useBillWiseReport(outletId, dateRange.from, dateRange.to, page);

  const columns = useMemo(
    () => ['Invoice #', 'Date', 'Customer', 'Table', 'Waiter', 'Payment', 'Subtotal', 'Discount', 'Tax', 'Total'],
    [],
  );

  const rows = useMemo(
    () =>
      (data?.data ?? []).map((row: any) => [
        row.invoiceNumber ?? '-',
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-',
        row.userName ?? row.customerName ?? '-',
        row.tableName ?? '-',
        row.waiterName ?? '-',
        row.paymentMethod ?? '-',
        row.subtotal ?? 0,
        row.discount ?? 0,
        row.tax ?? row.gst ?? 0,
        row.total ?? row.payable ?? 0,
      ]),
    [data],
  );

  const totalRow = useMemo(
    () =>
      data?.totals
        ? ['TOTAL', '', '', '', '', '', data.totals.subtotal, data.totals.discount, data.totals.tax, data.totals.total]
        : undefined,
    [data],
  );

  const handleDateChange = useCallback(
    (r: any) => { setDateRange(r); setPage(1); },
    [setDateRange],
  );

  return (
    <ScreenWrapper>
      <TopBar title="Bill-wise Report" showBack onBack={() => navigation.goBack()} />
      <DateRangePicker value={dateRange} onChange={handleDateChange} />
      <ReportTable
        columns={columns}
        rows={rows}
        totalRow={totalRow}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
      />
      {data?.pagination && (
        <PaginationBar pagination={data.pagination} onPageChange={setPage} />
      )}
    </ScreenWrapper>
  );
}
