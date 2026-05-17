import React, { useCallback } from 'react';
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
  const handleRefresh = useCallback(() => { refetch(); }, [refetch]);

  // Destructure exactly as banana_boss UnifiedSalesDashboard does
  const paidAll         = (data as any)?.paidAll         ?? { totals: {}, paymentModes: {}, roundOff: {} };
  const paidNormal      = (data as any)?.paidNormal      ?? { totals: {} };
  const duesSettlements = (data as any)?.duesSettlements ?? { totals: {} };
  const discountSummary = (data as any)?.discountSummary ?? { onPaid: {}, onDues: {} };
  const duesSummary     = (data as any)?.duesSummary     ?? { duesGiven: 0, duesOutstanding: 0, ordersPending: 0, duesGetBack: 0 };
  const taxesSummary    = (data as any)?.taxesSummary    ?? { all: {}, onPaid: {} };
  const runningTables   = (data as any)?.runningTables   ?? { tables: [], totalActiveTableValue: 0 };

  const hasDues =
    (duesSummary?.duesGiven || 0) > 0 ||
    (duesSummary?.duesOutstanding || 0) > 0 ||
    (duesSummary?.ordersPending || 0) > 0;

  const paymentModeEntries = Object.entries(paidAll?.paymentModes ?? {}) as [string, number][];
  const tables = (runningTables?.tables ?? []) as { name: string; amount: number }[];

  return (
    <ScreenWrapper scrollable refreshControl onRefresh={handleRefresh}>
      <TopBar title="Sales Dashboard" subtitle={currentOutlet?.name || ''} />
      <DateRangePicker value={dateRange} onChange={setDateRange} outletId={outletId} />

      {isLoading && <LoadingSkeleton type="metric-card" count={6} />}
      {isError && !isLoading && <ErrorState onRetry={handleRefresh} />}

      {data && !isLoading && (
        <>
          {/* Revenue Overview */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500 }}
          >
            <Text style={s.sectionLabel}>Revenue Overview</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {[
                  { title: 'Net Sales',      value: format(paidAll?.totals?.netAfterDiscountAndCharges || 0), icon: 'trending-up',  tone: 'success'  as const, delay: 0 },
                  { title: 'Orders',         value: String(paidAll?.totals?.ordersCount || 0),               icon: 'shopping-bag', tone: 'default'  as const, delay: 60 },
                  { title: 'Guests',         value: String(paidAll?.totals?.paxCount || 0),                  icon: 'users',        tone: 'default'  as const, delay: 120 },
                  { title: 'Normal Sales',   value: format(paidNormal?.totals?.netAfterDiscountAndCharges || 0), icon: 'check-circle', tone: 'default' as const, delay: 180 },
                  { title: 'Dues Recovered', value: format(duesSettlements?.totals?.netAfterDiscountAndCharges || 0), icon: 'refresh-cw', tone: 'default' as const, delay: 240 },
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

          {/* Payment Modes */}
          {paymentModeEntries.length > 0 && (
            <MotiView
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 300 }}
            >
              <Text style={s.sectionLabel}>Payment Modes</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {paymentModeEntries.map(([mode, amount], i) => (
                    <MotiView
                      key={mode}
                      from={{ opacity: 0, translateX: 12 }}
                      animate={{ opacity: 1, translateX: 0 }}
                      transition={{ type: 'timing', duration: 350, delay: 300 + i * 70 }}
                    >
                      <View style={s.modeChip}>
                        <Text style={s.modeChipLabel}>{mode}</Text>
                        <Text style={s.modeChipValue}>{format(Number(amount))}</Text>
                      </View>
                    </MotiView>
                  ))}
                </View>
              </ScrollView>
            </MotiView>
          )}

          {/* Discounts & Taxes */}
          <MotiView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 400 }}
          >
            <Text style={s.sectionLabel}>Discounts &amp; Taxes</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {[
                  { title: 'Discount',    value: format(discountSummary?.onPaid?.total || 0),           icon: 'percent',   tone: 'danger'  as const },
                  { title: 'GST',         value: format(taxesSummary?.onPaid?.tax || 0),                icon: 'file-text', tone: 'default' as const },
                  { title: 'Service Chg', value: format(taxesSummary?.onPaid?.serviceCharge || 0),      icon: 'briefcase', tone: 'default' as const },
                  { title: 'Tips',        value: format(taxesSummary?.onPaid?.tip || 0),                icon: 'smile',     tone: 'default' as const },
                ].map((card, i) => (
                  <MotiView
                    key={card.title}
                    from={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 350, delay: 400 + i * 60 }}
                  >
                    <MetricCard title={card.title} value={card.value} icon={card.icon} tone={card.tone} />
                  </MotiView>
                ))}
              </View>
            </ScrollView>
          </MotiView>

          {/* Dues Position */}
          {hasDues && (
            <MotiView
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 500 }}
            >
              <Text style={s.sectionLabel}>Dues Position</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {[
                    { title: 'Dues Given',      value: format(duesSummary?.duesGiven || 0),       icon: 'arrow-up-circle',   tone: 'danger'  as const },
                    { title: 'Outstanding',     value: format(duesSummary?.duesOutstanding || 0), icon: 'alert-circle',      tone: 'danger'  as const },
                    { title: 'Pending Orders',  value: String(duesSummary?.ordersPending || 0),   icon: 'clock',             tone: 'default' as const },
                    { title: 'Get Back',        value: format(duesSummary?.duesGetBack || 0),     icon: 'arrow-down-circle', tone: 'success' as const },
                  ].map((card, i) => (
                    <MotiView
                      key={card.title}
                      from={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'timing', duration: 350, delay: 500 + i * 60 }}
                    >
                      <MetricCard title={card.title} value={card.value} icon={card.icon} tone={card.tone} />
                    </MotiView>
                  ))}
                </View>
              </ScrollView>
            </MotiView>
          )}

          {/* Running Tables */}
          {tables.length > 0 && (
            <MotiView
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 600 }}
            >
              <Text style={s.sectionLabel}>
                Running Tables ({tables.length}) — {format(runningTables?.totalActiveTableValue || 0)}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {tables.map((t, i) => (
                    <MotiView
                      key={`${t.name}-${i}`}
                      from={{ opacity: 0, translateX: 12 }}
                      animate={{ opacity: 1, translateX: 0 }}
                      transition={{ type: 'timing', duration: 350, delay: 600 + i * 50 }}
                    >
                      <View style={s.tableChip}>
                        <Text style={s.tableChipName}>{t.name}</Text>
                        <Text style={s.tableChipValue}>{format(t.amount)}</Text>
                      </View>
                    </MotiView>
                  ))}
                </View>
              </ScrollView>
            </MotiView>
          )}
        </>
      )}
    </ScreenWrapper>
  );
}

const s = {
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800' as const,
    color: '#9CA3AF',
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    marginTop: 20,
    marginBottom: 10,
  },
  modeChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center' as const,
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  modeChipLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
    marginBottom: 4,
  },
  modeChipValue: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: '#111827',
  },
  tableChip: {
    backgroundColor: '#FEF9C3',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center' as const,
    minWidth: 80,
  },
  tableChipName: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '700' as const,
    marginBottom: 3,
  },
  tableChipValue: {
    fontSize: 14,
    fontWeight: '800' as const,
    color: '#78350F',
  },
};
