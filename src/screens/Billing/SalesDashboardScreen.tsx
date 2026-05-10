import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
import { useBillsDashboardQuery } from '@/queries/bills';
import { useCurrency } from '@/hooks/useCurrency';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { DateRangePicker, MetricCard, LoadingSkeleton, ErrorState } from '@/components/shared';

export function SalesDashboardScreen() {
  const { outletId, currentOutlet } = useOutlet();
  const dateRange = useAppStore((s) => s.reportsDateRange);
  const setDateRange = useAppStore((s) => s.setReportsDateRange);
  const { data, isLoading, isError, refetch } = useBillsDashboardQuery(outletId, dateRange.from, dateRange.to);
  const { format } = useCurrency();

  const summary = data?.overall || data?.paidAll;

  return (
    <ScreenWrapper scrollable refreshControl onRefresh={refetch}>
      <TopBar title="Sales Dashboard" subtitle={currentOutlet?.name || ''} />
      <DateRangePicker value={dateRange} onChange={setDateRange} />

      {isLoading && <LoadingSkeleton type="metric-card" count={4} />}
      {isError && <ErrorState onRetry={refetch} />}

      {summary && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <MetricCard title="Total Sale" value={format(summary.totalSale || 0)} icon="trending-up" tone="success" />
            <MetricCard title="Orders" value={String(summary.totalOrders || 0)} icon="shopping-bag" />
            <MetricCard title="Discount" value={format(summary.totalDiscount || 0)} icon="percent" tone="danger" />
            <MetricCard title="Tax" value={format(summary.totalTax || 0)} icon="file-text" />
            <MetricCard title="Service Charge" value={format(summary.serviceCharge || 0)} icon="briefcase" />
            <MetricCard title="Tips" value={format(summary.tips || 0)} icon="smile" />
          </View>
        </ScrollView>
      )}
    </ScreenWrapper>
  );
}
