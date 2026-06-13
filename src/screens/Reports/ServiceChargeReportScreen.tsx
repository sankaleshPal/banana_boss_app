import React, { useState, useMemo, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
import { useServiceChargeReport } from '@/queries/reports';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { DateRangePicker, ReportTable, ReportSummary, PaginationBar } from '@/components/shared';

export function ServiceChargeReportScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ReportsStackParamList>>();
  const { outletId } = useOutlet();
  const dateRange = useAppStore((s) => s.reportsDateRange);
  const setDateRange = useAppStore((s) => s.setReportsDateRange);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useServiceChargeReport(outletId, dateRange.from, dateRange.to, page);

  const columns = useMemo(
    () => ['Bill #', 'Service Charge', 'Container Charge', 'Delivery Charge', 'Total'],
    [],
  );

  const rows = useMemo(
    () =>
      (data?.data ?? []).map((row: any) => [
        row.invoiceNumber ?? '-',
        row.serviceCharge ?? 0,
        row.containerCharge ?? 0,
        row.deliveryCharge ?? 0,
        row.total ?? 0,
      ]),
    [data],
  );

  const handleDateChange = useCallback(
    (r: any) => { setDateRange(r); setPage(1); },
    [setDateRange],
  );

  return (
    <ScreenWrapper scrollable refreshControl onRefresh={refetch}>
      <TopBar title="Service Charge Report" showBack onBack={() => navigation.goBack()} />
      <DateRangePicker value={dateRange} onChange={handleDateChange} outletId={outletId} />
      <ReportSummary
        data={data?.data}
        isLoading={isLoading}
        totals={data?.totals}
        totalCount={data?.pagination?.total}
        metrics={[
          { label: 'Bills', count: true, icon: 'file-text' },
          { label: 'Service Charge', fields: ['serviceCharge'], totalsKey: 'serviceCharge', format: 'currency', icon: 'briefcase', tone: 'success' },
          { label: 'Container', fields: ['containerCharge'], totalsKey: 'containerCharge', format: 'currency', icon: 'box' },
          { label: 'Delivery', fields: ['deliveryCharge'], totalsKey: 'deliveryCharge', format: 'currency', icon: 'truck' },
          { label: 'Total Charges', fields: ['total'], totalsKey: 'total', format: 'currency', icon: 'trending-up', tone: 'success' },
        ]}
      />
      <ReportTable columns={columns} rows={rows} isLoading={isLoading} isError={isError} onRetry={refetch} downloadReportId="service-charge" outletId={outletId} from={dateRange.from} to={dateRange.to} />
      {data?.pagination && <PaginationBar pagination={data.pagination} onPageChange={setPage} />}
    </ScreenWrapper>
  );
}
