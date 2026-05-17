import React, { useMemo, useCallback } from 'react';
import { View, Text } from 'react-native';
import { MotiView } from 'moti';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
import { useNetSalesReport } from '@/queries/reports';
import { useCurrency } from '@/hooks/useCurrency';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { DateRangePicker, MetricCard, LoadingSkeleton, ErrorState, SectionHeader } from '@/components/shared';

export function NetSalesSummaryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ReportsStackParamList>>();
  const { outletId } = useOutlet();
  const dateRange = useAppStore((s) => s.reportsDateRange);
  const setDateRange = useAppStore((s) => s.setReportsDateRange);
  const { data: rawList = [], isLoading, isError, refetch } = useNetSalesReport(
    outletId,
    dateRange.from,
    dateRange.to,
  );
  const { format } = useCurrency();

  // API returns NetSalesSummaryResponse[] — aggregate across all outlets in the array
  const totals = useMemo(() => {
    return (rawList as any[]).reduce(
      (acc, r) => {
        const s = r?.data?.summary;
        const d = r?.data?.duesSummary;
        if (!s) return acc;
        return {
          totalOrders: acc.totalOrders + (s.totalOrders ?? 0),
          subtotal: acc.subtotal + (s.subtotal ?? 0),
          discount: acc.discount + (s.discount ?? 0),
          complementary: acc.complementary + (s.complementary ?? 0),
          npc: acc.npc + (s.npc ?? 0),
          serviceCharge: acc.serviceCharge + (s.serviceCharge ?? 0),
          gst: acc.gst + (s.gst ?? 0),
          tips: acc.tips + (s.tips ?? 0),
          totalSales: acc.totalSales + (s.totalSales ?? 0),
          netSales: acc.netSales + (s.netSales ?? 0),
          duesTotal: acc.duesTotal + (d?.total ?? 0),
          duesCount: acc.duesCount + (d?.count ?? 0),
        };
      },
      {
        totalOrders: 0, subtotal: 0, discount: 0, complementary: 0, npc: 0,
        serviceCharge: 0, gst: 0, tips: 0, totalSales: 0, netSales: 0,
        duesTotal: 0, duesCount: 0,
      },
    );
  }, [rawList]);

  const handleRefresh = useCallback(() => { refetch(); }, [refetch]);

  const metricCards = useMemo(
    () => [
      { title: 'Orders', value: String(totals.totalOrders), icon: 'shopping-bag', tone: 'default' as const },
      { title: 'Subtotal', value: format(totals.subtotal), icon: 'file-text', tone: 'success' as const },
      { title: 'Discount', value: format(totals.discount), icon: 'percent', tone: 'danger' as const },
      { title: 'Complimentary', value: format(totals.complementary), icon: 'gift', tone: 'muted' as const },
      { title: 'GST', value: format(totals.gst), icon: 'briefcase', tone: 'default' as const },
      { title: 'Service Charge', value: format(totals.serviceCharge), icon: 'layers', tone: 'default' as const },
      { title: 'Tips', value: format(totals.tips), icon: 'smile', tone: 'default' as const },
      { title: 'Total Sales', value: format(totals.totalSales), icon: 'dollar-sign', tone: 'success' as const },
      { title: 'Net Sales', value: format(totals.netSales), icon: 'trending-up', tone: 'success' as const },
    ],
    [totals, format],
  );

  return (
    <ScreenWrapper scrollable refreshControl onRefresh={handleRefresh}>
      <TopBar title="Net Sales Summary" showBack onBack={() => navigation.goBack()} />
      <DateRangePicker value={dateRange} onChange={(r) => { setDateRange(r); }} outletId={outletId} />

      {isLoading && <LoadingSkeleton type="metric-card" count={6} />}
      {isError && !isLoading && <ErrorState onRetry={handleRefresh} />}

      {!isLoading && !isError && rawList.length > 0 && (
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
        >
          <SectionHeader title="Sales Breakdown" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 }}>
            {metricCards.map((card, i) => (
              <MotiView
                key={card.title}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 350, delay: i * 50 }}
                style={{ width: '47%' }}
              >
                <MetricCard
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  tone={card.tone}
                />
              </MotiView>
            ))}
          </View>

          {/* Dues summary if present */}
          {totals.duesTotal > 0 && (
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 500 }}
            >
              <SectionHeader title="Dues" />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1, backgroundColor: '#FEF3C7', borderRadius: 14, padding: 16 }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#92400E', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    Total Dues
                  </Text>
                  <Text style={{ fontSize: 22, fontWeight: '900', color: '#92400E', marginTop: 6 }}>
                    {format(totals.duesTotal)}
                  </Text>
                </View>
                <View style={{ flex: 1, backgroundColor: '#F3F4F6', borderRadius: 14, padding: 16 }}>
                  <Text style={{ fontSize: 11, fontWeight: '800', color: '#374151', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    Dues Count
                  </Text>
                  <Text style={{ fontSize: 22, fontWeight: '900', color: '#111827', marginTop: 6 }}>
                    {totals.duesCount}
                  </Text>
                </View>
              </View>
            </MotiView>
          )}
        </MotiView>
      )}

      {!isLoading && !isError && rawList.length === 0 && (
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          style={{ marginTop: 40, alignItems: 'center' }}
        >
          <Text style={{ fontSize: 14, color: '#9CA3AF' }}>No data for the selected date range.</Text>
        </MotiView>
      )}

      <View style={{ height: 32 }} />
    </ScreenWrapper>
  );
}
