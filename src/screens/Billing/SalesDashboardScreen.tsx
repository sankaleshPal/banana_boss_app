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

  // ── Destructure using the exact same paths as banana_boss UnifiedSalesDashboard ──
  const paidAll         = (data as any)?.paidAll         ?? { totals: {}, paymentModes: {}, roundOff: {} };
  const paidNormal      = (data as any)?.paidNormal      ?? { totals: {} };
  const duesSettlements = (data as any)?.duesSettlements ?? { totals: {} };
  const discountSummary = (data as any)?.discountSummary ?? { onPaid: {}, onDues: {} };
  const rewardsSummary  = (data as any)?.rewardsSummary  ?? { all: {}, onPaid: {}, onDues: {} };
  const duesSummary     = (data as any)?.duesSummary     ?? { duesGiven: 0, duesOutstanding: 0, ordersPending: 0, duesGetBack: 0 };
  const taxesSummary    = (data as any)?.taxesSummary    ?? { all: {}, onPaid: {} };
  const runningTables   = (data as any)?.runningTables   ?? { tables: [], totalActiveTableValue: 0 };

  const hasDues =
    (duesSummary?.duesGiven || 0) > 0 ||
    (duesSummary?.duesOutstanding || 0) > 0 ||
    (duesSummary?.ordersPending || 0) > 0;

  // paidAll.paymentModes is Record<string, number>
  const paymentModeEntries = Object.entries(paidAll?.paymentModes ?? {}) as [string, number][];

  // runningTables.tables is [{ name, amount }]
  const tables = (runningTables?.tables ?? []) as { name: string; amount: number }[];

  return (
    <ScreenWrapper scrollable refreshControl onRefresh={handleRefresh}>
      <TopBar title="Sales Dashboard" subtitle={currentOutlet?.name || ''} />
      <DateRangePicker value={dateRange} onChange={setDateRange} outletId={outletId} />

      {isLoading && <LoadingSkeleton type="metric-card" count={6} />}
      {isError && !isLoading && <ErrorState onRetry={handleRefresh} />}

      {data && !isLoading && (
        <>
          {/* ── Revenue Overview ─────────────────────────────────────────── */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500 }}
          >
            <Text style={s.sectionLabel}>Revenue Overview</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {[
                  { title: 'Net Sales',      value: format(paidAll?.totals?.netAfterDiscountAndCharges || 0), icon: 'trending-up',   tone: 'success' as const, delay: 0 },
                  { title: 'Orders',         value: String(paidAll?.totals?.ordersCount || 0),               icon: 'shopping-bag',   tone: 'default' as const, delay: 60 },
                  { title: 'Guests',         value: String(paidAll?.totals?.paxCount || 0),                  icon: 'users',          tone: 'default' as const, delay: 120 },
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

          {/* ── Payment Modes ─────────────────────────────────────────────── */}
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

          {/* ── Discounts & Taxes ─────────────────────────────────────────── */}
          <MotiView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 400 }}
          >
            <Text style={s.sectionLabel}>Discounts &amp; Taxes</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {[
                  { title: 'Discount',      value: format(discountSummary?.onPaid?.total || 0),           icon: 'percent',   tone: 'danger' as const, delay: 0 },
                  { title: 'GST',           value: format(taxesSummary?.onPaid?.tax || 0),                icon: 'file-text', tone: 'default' as const, delay: 70 },
                  { title: 'Service Chg',   value: format(taxesSummary?.onPaid?.serviceCharge || 0),      icon: 'briefcase', tone: 'default' as const, delay: 140 },
                  { title: 'Tips',          value: format(taxesSummary?.onPaid?.tip || 0),                icon: 'smile',     tone: 'default' as const, delay: 210 },
                  { title: 'Rewards Given', value: `${rewardsSummary?.all?.coinsGiven || 0} pts`,         icon: 'gift',      tone: 'default' as const, delay: 280 },
                ].map((card) => (
                  <MotiView
                    key={card.title}
                    from={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 400, delay: 400 + card.delay }}
                  >
                    <MetricCard title={card.title} value={card.value} icon={card.icon} tone={card.tone} />
                  </MotiView>
                ))}
              </View>
            </ScrollView>
          </MotiView>

          {/* ── Dues Position (conditional) ───────────────────────────────── */}
          {hasDues && (
            <MotiView
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 520 }}
            >
              <Text style={s.sectionLabel}>Dues &amp; Credits</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {[
                  { label: 'Outstanding',   value: format(duesSummary?.duesOutstanding || 0) },
                  { label: 'Given (New)',    value: format(duesSummary?.duesGiven || 0) },
                  { label: 'Recovered',     value: format(duesSummary?.duesGetBack || 0) },
                  { label: 'Pending Orders',value: String(duesSummary?.ordersPending || 0) },
                ].map(({ label, value }) => (
                  <View key={label} style={s.duesChip}>
                    <Text style={s.duesChipLabel}>{label}</Text>
                    <Text style={s.duesChipValue}>{value}</Text>
                  </View>
                ))}
              </View>
            </MotiView>
          )}

          {/* ── Running Tables ────────────────────────────────────────────── */}
          {tables.length > 0 && (
            <MotiView
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 600 }}
            >
              <Text style={s.sectionLabel}>
                Active Tables ({tables.length}) — Total: {format(runningTables?.totalActiveTableValue || 0)}
              </Text>
              {tables.map((table, i) => (
                <MotiView
                  key={table.name || String(i)}
                  from={{ opacity: 0, translateX: -10 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: 'timing', duration: 300, delay: 600 + i * 50 }}
                >
                  <View style={s.tableRow}>
                    <Text style={s.tableRowName}>{table.name || `Table ${i + 1}`}</Text>
                    <Text style={s.tableRowAmount}>{format(table.amount || 0)}</Text>
                  </View>
                </MotiView>
              ))}
            </MotiView>
          )}
        </>
      )}

      <View style={{ height: 32 }} />
    </ScreenWrapper>
  );
}

const s = {
  sectionLabel: {
    fontSize: 11, fontWeight: '800' as const, color: '#9CA3AF',
    letterSpacing: 1, textTransform: 'uppercase' as const,
    marginTop: 24, marginBottom: 12,
  },
  modeChip: {
    backgroundColor: '#F3F4F6', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, minWidth: 120,
  },
  modeChipLabel: {
    fontSize: 10, fontWeight: '800' as const, color: '#9CA3AF',
    textTransform: 'uppercase' as const, letterSpacing: 0.8, marginBottom: 4,
  },
  modeChipValue: { fontSize: 18, fontWeight: '900' as const, color: '#111827' },
  duesChip: {
    backgroundColor: '#FEF2F2', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10, minWidth: '47%' as any,
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.15)',
  },
  duesChipLabel: {
    fontSize: 10, fontWeight: '700' as const, color: '#EF4444',
    textTransform: 'uppercase' as const, letterSpacing: 0.8, marginBottom: 4,
  },
  duesChipValue: { fontSize: 16, fontWeight: '800' as const, color: '#991B1B' },
  tableRow: {
    flexDirection: 'row' as const, justifyContent: 'space-between' as const,
    alignItems: 'center' as const, backgroundColor: '#FFFFFF', borderRadius: 10,
    padding: 14, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)',
  },
  tableRowName:   { fontSize: 14, fontWeight: '700' as const, color: '#111827' },
  tableRowAmount: { fontSize: 14, fontWeight: '900' as const, color: '#059669' },
} as const;
