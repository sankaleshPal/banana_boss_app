import React, { useMemo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
import { useDiscountReport } from '@/queries/reports';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { DateRangePicker, ReportTable } from '@/components/shared';

export function DiscountReportScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ReportsStackParamList>>();
  const { outletId } = useOutlet();
  const dateRange = useAppStore((s) => s.reportsDateRange);
  const setDateRange = useAppStore((s) => s.setReportsDateRange);
  const { data, isLoading, isError, refetch } = useDiscountReport(outletId, dateRange.from, dateRange.to);

  const columns = useMemo(() => ['Discount Name', 'Count', 'Amount'], []);

  const rows = useMemo(
    () =>
      (data?.data ?? []).map((row: any) => [
        row.discountName ?? '-',
        row.count ?? 0,
        row.amount ?? 0,
      ]),
    [data],
  );

  const handleDateChange = useCallback((r: any) => setDateRange(r), [setDateRange]);

  return (
    <ScreenWrapper>
      <TopBar title="Discount Report" showBack onBack={() => navigation.goBack()} />
      <DateRangePicker value={dateRange} onChange={handleDateChange} outletId={outletId} />
      <ReportTable columns={columns} rows={rows} isLoading={isLoading} isError={isError} onRetry={refetch} downloadReportId="discount" outletId={outletId} from={dateRange.from} to={dateRange.to} />
    </ScreenWrapper>
  );
}
