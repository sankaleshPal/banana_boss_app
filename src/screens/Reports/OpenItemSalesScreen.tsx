import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
import { useOpenItemReport } from '@/queries/reports';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { DateRangePicker, ReportTable, PaginationBar } from '@/components/shared';

export function OpenItemSalesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ReportsStackParamList>>();
  const { outletId } = useOutlet();
  const dateRange = useAppStore((s) => s.reportsDateRange);
  const setDateRange = useAppStore((s) => s.setReportsDateRange);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useOpenItemReport(outletId, dateRange.from, dateRange.to, page);

  const columns = ['Item Name', 'Qty', 'Gross', 'Discount', 'Tax', 'Total'];
  const rows = (data?.data || []).map((row: any) => [
    row.itemName,
    row.quantity,
    row.gross,
    row.discount,
    row.tax,
    row.total,
  ]);

  return (
    <ScreenWrapper>
      <TopBar title="Open Item Sales" showBack onBack={() => navigation.goBack()} />
      <DateRangePicker value={dateRange} onChange={(r) => { setDateRange(r); setPage(1); }} />
      <ReportTable columns={columns} rows={rows} isLoading={isLoading} isError={isError} onRetry={refetch} />
      {data?.pagination && <PaginationBar pagination={data.pagination} onPageChange={setPage} />}
    </ScreenWrapper>
  );
}
