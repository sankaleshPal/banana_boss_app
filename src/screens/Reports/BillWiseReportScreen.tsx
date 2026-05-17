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
      (data?.data ?? []).map((row: any) => {
        // Backend shape: { bill: { invoiceNumber, payable, paymentMethod, subtotal, discountTotal, totalTax, createdAt }, userName, tableName, waiterName }
        const bill = row.bill ?? row;
        return [
          bill.invoiceNumber ?? '-',
          bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : '-',
          row.userName ?? bill.customerName ?? '-',
          row.tableName ?? '-',
          row.waiterName ?? '-',
          bill.paymentMethod ?? '-',
          bill.subtotal ?? 0,
          bill.discountTotal ?? bill.discount ?? 0,
          bill.totalTax ?? bill.tax ?? 0,
          bill.payable ?? bill.total ?? 0,
        ];
      }),
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
      <DateRangePicker value={dateRange} onChange={handleDateChange} outletId={outletId} />
      <ReportTable
        columns={columns}
        rows={rows}
        totalRow={totalRow}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        downloadReportId="bill-wise"
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
