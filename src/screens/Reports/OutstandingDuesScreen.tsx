import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useOutstandingDuesReport } from '@/queries/reports';
import { useCurrency } from '@/hooks/useCurrency';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { ReportTable } from '@/components/shared';

export function OutstandingDuesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ReportsStackParamList>>();
  const { outletId } = useOutlet();
  const { data, isLoading, isError, refetch } = useOutstandingDuesReport(outletId);
  const { format } = useCurrency();

  const columns = ['Customer', 'Phone', 'Amount', 'Status'];
  const rows = (data?.data || []).map((row: any) => [
    row.customerName,
    row.phone || '-',
    format(row.amount || 0),
    row.status,
  ]);

  return (
    <ScreenWrapper>
      <TopBar title="Outstanding Dues" showBack onBack={() => navigation.goBack()} />
      <ReportTable columns={columns} rows={rows} isLoading={isLoading} isError={isError} onRetry={refetch} />
    </ScreenWrapper>
  );
}
