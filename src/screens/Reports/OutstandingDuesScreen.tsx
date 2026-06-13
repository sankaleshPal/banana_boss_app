import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useOutstandingDuesReport } from '@/queries/reports';
import { useCurrency } from '@/hooks/useCurrency';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { ReportTable, ReportSummary } from '@/components/shared';

export function OutstandingDuesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ReportsStackParamList>>();
  const { outletId } = useOutlet();
  const { data, isLoading, isError, refetch } = useOutstandingDuesReport(outletId);
  const { format } = useCurrency();

  const columns = useMemo(() => ['Customer', 'Phone', 'Amount', 'Status'], []);

  const rows = useMemo(
    () =>
      (data?.data ?? []).map((row: any) => [
        row.customerName ?? '-',
        row.phone ?? '-',
        format(row.amount ?? 0),
        row.status ?? '-',
      ]),
    [data, format],
  );

  return (
    <ScreenWrapper scrollable refreshControl onRefresh={refetch}>
      <TopBar title="Outstanding Dues" showBack onBack={() => navigation.goBack()} />
      <ReportSummary
        data={data?.data}
        isLoading={isLoading}
        metrics={[
          { label: 'Customers', count: true, icon: 'users' },
          { label: 'Total Outstanding', fields: ['amount'], format: 'currency', icon: 'alert-circle', tone: 'danger' },
        ]}
        chart={{ title: 'Top outstanding', labelFields: ['customerName', 'phone'], valueFields: ['amount'], format: 'currency' }}
      />
      <ReportTable columns={columns} rows={rows} isLoading={isLoading} isError={isError} onRetry={refetch} />
    </ScreenWrapper>
  );
}
