import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
import { useTransferKotReport } from '@/queries/reports';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { DateRangePicker, ReportTable, PaginationBar } from '@/components/shared';

export function TransferKotReportScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ReportsStackParamList>>();
  const { outletId } = useOutlet();
  const dateRange = useAppStore((s) => s.reportsDateRange);
  const setDateRange = useAppStore((s) => s.setReportsDateRange);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useTransferKotReport(outletId, dateRange.from, dateRange.to, page);

  const columns = ['KOT ID', 'From', 'To', 'Items', 'Date'];
  const rows = (data?.data || []).map((row: any) => [
    row.kotId,
    row.fromTable,
    row.toTable,
    row.itemNames,
    new Date(row.createdAt).toLocaleDateString(),
  ]);

  return (
    <ScreenWrapper>
      <TopBar title="Transfer KOT Report" showBack onBack={() => navigation.goBack()} />
      <DateRangePicker value={dateRange} onChange={(r) => { setDateRange(r); setPage(1); }} />
      <ReportTable columns={columns} rows={rows} isLoading={isLoading} isError={isError} onRetry={refetch} />
      {data?.pagination && <PaginationBar pagination={data.pagination} onPageChange={setPage} />}
    </ScreenWrapper>
  );
}
