import React, { useMemo, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MotiView } from 'moti';
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
  const { data, isLoading, isError, refetch } = useBillsDashboardQuery(
    outletId,
    dateRange.from,
    dateRange.to,
  );
  const { format } = useCurrency();

  // Normalise — server may return overall or paidAll depending on version
  const summary = useMemo(() => {
    if (!data) return null;
    return data.overall ?? data.paidAll ?? null;
  }, [data]);

  // Payment methods breakdown — convert Record<string, number> to array
  const paymentMethods = useMemo(() => {
    if (!data?.paymentMethods) return [];
    return Object.entries(data.paymentMethods).map(([method, amount]) => ({
      method,
      amount: Number(amount),
    }));
  }, [data]);

  const runningTables = useMemo(() => data?.runningTables ?? [], [data]);

  const handleRefresh = useCallback(() => { refetch(); }, [refetch]);

  return (
    <ScreenWrapper scrollable refreshControl onRefresh={handleRefresh}>
      <TopBar title="Sales Dashboard" subtitle={currentOutlet?.name || ''} />
      <DateRangePicker value={dateRange} onChange={setDateRange} />

      {isLoading && <LoadingSkeleton type="metric-card" count={6} />}
      {isError && !isLoading && <ErrorState onRetry={handleRefresh} />}

      {/* Summary metric cards */}
      {summary && !isLoading && (
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
        >
          <Text style={{
            fontSize: 11, fontWeight: '800', color: '#9CA3AF',
            letterSpacing: 1, textTransform: 'uppercase', marginTop: 20, marginBottom: 12,
          }}>
            Sales Overview
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {[
                { title: 'Total Sale', value: format(summary.totalSale || 0), icon: 'trending-up', tone: 'success' as const, delay: 0 },
                { title: 'Orders', value: String(summary.totalOrders || 0), icon: 'shopping-bag', tone: 'default' as const, delay: 60 },
                { title: 'Discount', value: format(summary.totalDiscount || 0), icon: 'percent', tone: 'danger' as const, delay: 120 },
                { title: 'Tax', value: format(summary.totalTax || 0), icon: 'file-text', tone: 'default' as const, delay: 180 },
                { title: 'Service', value: format(summary.serviceCharge || 0), icon: 'briefcase', tone: 'default' as const, delay: 240 },
                { title: 'Tips', value: format(summary.tips || 0), icon: 'smile', tone: 'default' as const, delay: 300 },
              ].map((card) => (
                <MotiView
                  key={card.title}
                  from={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'timing', duration: 400, delay: card.delay }}
                >
                  <MetricCard title={card.title} value={card.value} icon={card.icon} tone={card.tone} />
                </MotiView>
              ))}
            </View>
          </ScrollView>
        </MotiView>
      )}

      {/* Payment Methods breakdown */}
      {paymentMethods.length > 0 && !isLoading && (
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 360 }}
        >
          <Text style={{
            fontSize: 11, fontWeight: '800', color: '#9CA3AF',
            letterSpacing: 1, textTransform: 'uppercase', marginTop: 24, marginBottom: 12,
          }}>
            Payment Methods
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {paymentMethods.map(({ method, amount }, i) => (
                <MotiView
                  key={method}
                  from={{ opacity: 0, translateX: 12 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: 'timing', duration: 350, delay: 360 + i * 70 }}
                >
                  <View style={{
                    backgroundColor: '#F3F4F6', borderRadius: 12,
                    paddingHorizontal: 16, paddingVertical: 12, minWidth: 120,
                  }}>
                    <Text style={{
                      fontSize: 10, fontWeight: '800', color: '#9CA3AF',
                      textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4,
                    }}>
                      {method}
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: '900', color: '#111827' }}>
                      {format(amount)}
                    </Text>
                  </View>
                </MotiView>
              ))}
            </View>
          </ScrollView>
        </MotiView>
      )}

      {/* Active / Running Tables */}
      {runningTables.length > 0 && !isLoading && (
        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 500 }}
        >
          <Text style={{
            fontSize: 11, fontWeight: '800', color: '#9CA3AF',
            letterSpacing: 1, textTransform: 'uppercase', marginTop: 24, marginBottom: 12,
          }}>
            Active Tables ({runningTables.length})
          </Text>
          {(runningTables as any[]).map((table, i) => (
            <MotiView
              key={table.tableName || i}
              from={{ opacity: 0, translateX: -10 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'timing', duration: 300, delay: 500 + i * 50 }}
            >
              <View style={{
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: '#FFFFFF', borderRadius: 10, padding: 14, marginBottom: 8,
                borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
              }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>
                  {table.tableName || `Table ${i + 1}`}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '900', color: '#059669' }}>
                  {format(table.amount || 0)}
                </Text>
              </View>
            </MotiView>
          ))}
        </MotiView>
      )}

      <View style={{ height: 32 }} />
    </ScreenWrapper>
  );
}
