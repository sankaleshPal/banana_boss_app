import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
import { useNetSalesReport } from '@/queries/reports';
import { useCurrency } from '@/hooks/useCurrency';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { DateRangePicker, MetricCard, LoadingSkeleton, ErrorState } from '@/components/shared';

export function NetSalesSummaryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ReportsStackParamList>>();
  const { outletId } = useOutlet();
  const dateRange = useAppStore((s) => s.reportsDateRange);
  const setDateRange = useAppStore((s) => s.setReportsDateRange);
  const { data, isLoading, isError, refetch } = useNetSalesReport(outletId, dateRange.from, dateRange.to);
  const { format } = useCurrency();

  const totals = data?.totals || {};

  return (
    <ScreenWrapper scrollable>
      <TopBar title="Net Sales Summary" showBack onBack={() => navigation.goBack()} />
      <DateRangePicker value={dateRange} onChange={setDateRange} />

      {isLoading && <LoadingSkeleton type="metric-card" count={4} />}
      {isError && <ErrorState onRetry={refetch} />}

      {totals && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
          <MetricCard title="Orders" value={String(totals.orders || 0)} icon="shopping-bag" />
          <MetricCard title="Subtotal" value={format(Number(totals.subtotal || 0))} icon="file-text" tone="success" />
          <MetricCard title="Discount" value={format(Number(totals.discount || 0))} icon="percent" tone="danger" />
          <MetricCard title="GST" value={format(Number(totals.gst || 0))} icon="briefcase" />
          <MetricCard title="Service Charge" value={format(Number(totals.serviceCharge || 0))} icon="layers" />
          <MetricCard title="Tips" value={format(Number(totals.tips || 0))} icon="smile" />
          <MetricCard title="Net Sales" value={format(Number(totals.netSales || 0))} icon="trending-up" tone="success" />
        </View>
      )}
    </ScreenWrapper>
  );
}
