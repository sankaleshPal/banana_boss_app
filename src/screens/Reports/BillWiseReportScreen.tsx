import React, { useState } from 'react';
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

  const columns = ['Invoice #', 'Date', 'Customer', 'Table', 'Waiter', 'Payment', 'Subtotal', 'Discount', 'Tax', 'Payable'];
  const rows = (data?.data || []).map((row: any) => [
    row.invoiceNumber,
    new Date(row.createdAt).toLocaleDateString(),
    row.userName || '-',
    row.tableName || '-',
    row.waiterName || '-',
    row.paymentMethod || '-',
    row.subtotal,
    row.discount,
    row.tax,
    row.total,
  ]);
  const totalRow = data?.totals
    ? ['TOTAL', '', '', '', '', '', data.totals.subtotal, data.totals.discount, data.totals.tax, data.totals.total]
    : undefined;

  return (
    <ScreenWrapper>
      <TopBar title="Bill-wise Report" showBack onBack={() => navigation.goBack()} />
      <DateRangePicker value={dateRange} onChange={(r) => { setDateRange(r); setPage(1); }} />
      <ReportTable
        columns={columns}
        rows={rows}
        totalRow={totalRow}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        pagination={data?.pagination}
        onPageChange={setPage}
      />
    </ScreenWrapper>
  );
}
