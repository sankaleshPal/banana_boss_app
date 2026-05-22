import React, { useCallback, useMemo } from 'react';
import { View, Text, Dimensions, ActivityIndicator } from 'react-native';
import { MotiView } from 'moti';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
import { useBillsDashboardQuery } from '@/queries/bills';
import { useOutletDetails } from '@/queries/outlets';
import { useCurrency } from '@/hooks/useCurrency';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { DateRangePicker, LoadingSkeleton, ErrorState } from '@/components/shared';
import { fonts } from '@/theme';
import { getTodayRange, getBusinessDayRange } from '@/utils/date';
import { BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Feather';

export function SalesDashboardScreen() {
  const { outletId, currentOutlet } = useOutlet();
  const dateRange = useAppStore((s) => s.reportsDateRange);
  const setDateRange = useAppStore((s) => s.setReportsDateRange);

  const { data, isLoading, isError, refetch } = useBillsDashboardQuery(
    outletId,
    dateRange.from,
    dateRange.to,
  );
  
  const { data: outletDetail } = useOutletDetails(outletId);
  const billingStart = outletDetail?.billingStartTime ?? 0;
  const billingEnd   = outletDetail?.billingEndTime   ?? 0;

  const { format } = useCurrency();
  const handleRefresh = useCallback(() => { refetch(); }, [refetch]);

  // Determine if selected date range is today
  const isToday = useMemo(() => {
    if (dateRange.preset === 'today') return true;
    const todayRaw = getTodayRange();
    const todayBusiness = getBusinessDayRange(
      new Date(todayRaw.from),
      new Date(todayRaw.to),
      billingStart,
      billingEnd
    );
    return dateRange.from === todayBusiness.from.getTime() && dateRange.to === todayBusiness.to.getTime();
  }, [dateRange.preset, dateRange.from, dateRange.to, billingStart, billingEnd]);

  // Stable yesterday range calculated relative to dateRange (handles billing shifts perfectly and doesn't change on every render)
  const yesterdayRange = useMemo(() => {
    const oneDayMs = 24 * 60 * 60 * 1000;
    return {
      from: dateRange.from - oneDayMs,
      to: dateRange.to - oneDayMs,
    };
  }, [dateRange.from, dateRange.to]);

  // Yesterday query (only enabled if isToday is true)
  const { data: yesterdayData, isLoading: isLoadingYest, isError: isErrorYest } = useBillsDashboardQuery(
    outletId,
    yesterdayRange.from,
    yesterdayRange.to,
    isToday,
  );

  // Destructure with robust fallbacks
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

  const yesterdaySales = (yesterdayData as any)?.paidAll?.totals?.netAfterDiscountAndCharges || 0;
  const todaySales = paidAll?.totals?.netAfterDiscountAndCharges || 0;
  const salesChange = yesterdaySales > 0 ? ((todaySales - yesterdaySales) / yesterdaySales) * 100 : 0;
  const netSales = paidAll?.totals?.netAfterDiscountAndCharges || 0;

  return (
    <ScreenWrapper scrollable refreshControl onRefresh={handleRefresh}>
      <TopBar title="Sales Dashboard" subtitle={currentOutlet?.name || ''} />
      <View style={{ marginVertical: 8 }}>
        <DateRangePicker value={dateRange} onChange={setDateRange} outletId={outletId} />
      </View>

      {isLoading && <LoadingSkeleton type="metric-card" count={6} />}
      {isError && !isLoading && <ErrorState onRetry={handleRefresh} />}

      {data && !isLoading && (
        <>
          {/* Revenue Overview Grid */}
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500 }}
            style={{ marginTop: 8 }}
          >
            {/* Premium Gold/Dark Hero Card for Net Sales */}
            <View style={{
              backgroundColor: '#0F172A', // Deep Slate
              borderRadius: 24,
              padding: 22,
              borderLeftWidth: 6,
              borderLeftColor: '#FDE047', // Glowing Gold
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 4,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: '#1E293B',
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 11, fontWeight: '800', color: '#94A3B8', letterSpacing: 1.2, textTransform: 'uppercase' }}>
                  Net Sales
                </Text>
                
                {/* Live Pulse Indicator */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MotiView
                    from={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    transition={{
                      type: 'timing',
                      duration: 1000,
                      loop: true,
                    }}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#10B981',
                    }}
                  />
                  <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                    <Text style={{ fontFamily: fonts.bold, fontSize: 9, fontWeight: '800', color: '#10B981', textTransform: 'uppercase' }}>LIVE</Text>
                  </View>
                </View>
              </View>

              <Text style={{ fontFamily: fonts.bold, fontSize: 34, fontWeight: '900', color: '#FDE047', letterSpacing: -0.5 }}>
                {format(todaySales)}
              </Text>

              {/* Quick comparison mini badge on Hero Card */}
              {isToday && yesterdaySales > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 }}>
                  <View style={{
                    backgroundColor: salesChange >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 3
                  }}>
                    <Icon name={salesChange >= 0 ? 'trending-up' : 'trending-down'} size={11} color={salesChange >= 0 ? '#10B981' : '#EF4444'} />
                    <Text style={{ fontFamily: fonts.bold, fontSize: 11, fontWeight: '800', color: salesChange >= 0 ? '#10B981' : '#EF4444' }}>
                      {salesChange >= 0 ? '+' : ''}{salesChange.toFixed(1)}%
                    </Text>
                  </View>
                  <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: '#94A3B8' }}>vs yesterday same time</Text>
                </View>
              )}

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14, gap: 6, borderTopWidth: 1, borderTopColor: '#1E293B', paddingTop: 12 }}>
                <Icon name="check-circle" size={13} color="#10B981" />
                <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: '#94A3B8', fontWeight: '500' }}>
                  Includes normal sales & settled dues
                </Text>
              </View>
            </View>

            {/* Premium 2-Column Grid for Metrics */}
            <Text style={s.sectionLabel}>Revenue Overview</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
              <View style={[s.gridCard, { borderLeftColor: '#3B82F6', borderLeftWidth: 4 }]}>
                <View style={[s.iconBg, { backgroundColor: '#EFF6FF' }]}>
                  <Icon name="shopping-bag" size={15} color="#3B82F6" />
                </View>
                <Text style={s.cardLabel}>Orders</Text>
                <Text style={s.cardValue}>{String(paidAll?.totals?.ordersCount || 0)}</Text>
              </View>
              <View style={[s.gridCard, { borderLeftColor: '#10B981', borderLeftWidth: 4 }]}>
                <View style={[s.iconBg, { backgroundColor: '#ECFDF5' }]}>
                  <Icon name="users" size={15} color="#10B981" />
                </View>
                <Text style={s.cardLabel}>Guests</Text>
                <Text style={s.cardValue}>{String(paidAll?.totals?.paxCount || 0)}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              <View style={[s.gridCard, { borderLeftColor: '#F97316', borderLeftWidth: 4 }]}>
                <View style={[s.iconBg, { backgroundColor: '#FFF7ED' }]}>
                  <Icon name="check-circle" size={15} color="#F97316" />
                </View>
                <Text style={s.cardLabel}>Normal Sales</Text>
                <Text style={s.cardValue}>{format(paidNormal?.totals?.netAfterDiscountAndCharges || 0)}</Text>
              </View>
              <View style={[s.gridCard, { borderLeftColor: '#6366F1', borderLeftWidth: 4 }]}>
                <View style={[s.iconBg, { backgroundColor: '#EEF2FF' }]}>
                  <Icon name="refresh-cw" size={15} color="#6366F1" />
                </View>
                <Text style={s.cardLabel}>Dues Recovered</Text>
                <Text style={s.cardValue}>{format(duesSettlements?.totals?.netAfterDiscountAndCharges || 0)}</Text>
              </View>
            </View>
          </MotiView>

          {/* Today vs Yesterday Graphical Comparison Card */}
          {isToday && (
            <MotiView
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 200 }}
              style={{ marginTop: 8, marginBottom: 20 }}
            >
              <Text style={s.sectionLabel}>Sales Comparison</Text>
              <View style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                padding: 18,
                borderWidth: 1,
                borderColor: '#E2E8F0',
                shadowColor: '#0F172A',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.04,
                shadowRadius: 12,
                elevation: 2
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <View>
                    <Text style={{ fontFamily: fonts.bold, fontSize: 15, fontWeight: '800', color: '#0F172A' }}>Performance vs Yesterday</Text>
                    <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: '#64748B', marginTop: 2 }}>
                      Comparing matching billing shift windows
                    </Text>
                  </View>

                  {/* Profit/Loss Change Badge */}
                  {!isLoadingYest && !isErrorYest && yesterdaySales > 0 && (
                    <View style={{
                      backgroundColor: salesChange >= 0 ? '#DCFCE7' : '#FEE2E2',
                      paddingHorizontal: 9,
                      paddingVertical: 4,
                      borderRadius: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <Icon name={salesChange >= 0 ? 'arrow-up-right' : 'arrow-down-left'} size={13} color={salesChange >= 0 ? '#15803D' : '#B91C1C'} />
                      <Text style={{ fontFamily: fonts.bold, fontSize: 12, fontWeight: '800', color: salesChange >= 0 ? '#15803D' : '#B91C1C' }}>
                        {Math.abs(salesChange).toFixed(1)}%
                      </Text>
                    </View>
                  )}
                </View>

                {/* State-driven view for comparison data loading or error */}
                {isLoadingYest ? (
                  <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="small" color="#EAB308" />
                    <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: '#64748B', marginTop: 10 }}>
                      Loading yesterday's shift data...
                    </Text>
                  </View>
                ) : isErrorYest ? (
                  <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
                    <Icon name="alert-triangle" size={24} color="#EF4444" />
                    <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: '#EF4444', marginTop: 6 }}>
                      Failed to fetch yesterday's metrics
                    </Text>
                  </View>
                ) : (
                  <BarChart
                    data={{
                      labels: ['Yesterday', 'Today'],
                      datasets: [
                        {
                          data: [yesterdaySales, todaySales],
                        },
                      ],
                    }}
                    width={Dimensions.get('window').width - 68}
                    height={200}
                    yAxisLabel="₹"
                    yAxisSuffix=""
                    chartConfig={{
                      backgroundColor: '#FFFFFF',
                      backgroundGradientFrom: '#FFFFFF',
                      backgroundGradientTo: '#FFFFFF',
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(234, 179, 8, ${opacity})`,
                      labelColor: (opacity = 1) => `#64748B`,
                      propsForBackgroundLines: { strokeDasharray: '4', stroke: '#E2E8F0' },
                      barPercentage: 0.65,
                      fillShadowGradient: '#EAB308',
                      fillShadowGradientOpacity: 1,
                    }}
                    style={{ borderRadius: 16, alignSelf: 'center', marginRight: 10 }}
                    showValuesOnTopOfBars
                  />
                )}
              </View>
            </MotiView>
          )}

          {/* Payment Modes Progress Share */}
          {paymentModeEntries.length > 0 && (
            <MotiView
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 300 }}
              style={{ marginTop: 8, marginBottom: 20 }}
            >
              <Text style={s.sectionLabel}>Payment Modes Share</Text>
              <View style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                padding: 20,
                borderWidth: 1,
                borderColor: '#E2E8F0',
                shadowColor: '#0F172A',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.04,
                shadowRadius: 12,
                elevation: 2
              }}>
                {paymentModeEntries.map(([mode, amount], i) => {
                  const share = netSales > 0 ? (amount / netSales) * 100 : 0;
                  
                  // Color codes for badges
                  let badgeBg = '#F1F5F9';
                  let badgeText = '#475569';
                  const formattedMode = mode.toUpperCase();
                  
                  if (formattedMode.includes('UPI')) {
                    badgeBg = '#FAF5FF';
                    badgeText = '#8B5CF6'; // Purple
                  } else if (formattedMode.includes('CARD')) {
                    badgeBg = '#EFF6FF';
                    badgeText = '#3B82F6'; // Blue
                  } else if (formattedMode.includes('CASH')) {
                    badgeBg = '#ECFDF5';
                    badgeText = '#10B981'; // Green
                  } else if (formattedMode.includes('SPLIT')) {
                    badgeBg = '#FFFBEB';
                    badgeText = '#D97706'; // Amber
                  }

                  return (
                    <View key={mode} style={{ marginBottom: i === paymentModeEntries.length - 1 ? 0 : 16 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <View style={{ backgroundColor: badgeBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                            <Text style={{ fontFamily: fonts.bold, fontSize: 10, fontWeight: '800', color: badgeText }}>
                              {mode.replace('_', ' ')}
                            </Text>
                          </View>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={{ fontFamily: fonts.bold, fontSize: 14, fontWeight: '800', color: '#0F172A' }}>
                            {format(Number(amount))}
                          </Text>
                          <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: '#64748B', fontWeight: '600', marginTop: 1 }}>
                            {share.toFixed(1)}% share
                          </Text>
                        </View>
                      </View>
                      <View style={{ height: 6, width: '100%', backgroundColor: '#F1F5F9', borderRadius: 3, marginTop: 8 }}>
                        <View style={{ height: 6, width: `${Math.min(100, share)}%`, backgroundColor: badgeText, borderRadius: 3 }} />
                      </View>
                    </View>
                  );
                })}
              </View>
            </MotiView>
          )}

          {/* Discounts & Taxes Grid */}
          <MotiView
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 400 }}
            style={{ marginTop: 8, marginBottom: 20 }}
          >
            <Text style={s.sectionLabel}>Discounts &amp; Taxes</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
              <View style={[s.gridCard, { borderLeftColor: '#EF4444', borderLeftWidth: 4 }]}>
                <View style={[s.iconBg, { backgroundColor: '#FEE2E2' }]}>
                  <Icon name="percent" size={15} color="#EF4444" />
                </View>
                <Text style={s.cardLabel}>Discount</Text>
                <Text style={[s.cardValue, { color: '#EF4444' }]}>
                  {format(discountSummary?.onPaid?.total || 0)}
                </Text>
              </View>
              <View style={[s.gridCard, { borderLeftColor: '#14B8A6', borderLeftWidth: 4 }]}>
                <View style={[s.iconBg, { backgroundColor: '#F0FDFA' }]}>
                  <Icon name="file-text" size={15} color="#14B8A6" />
                </View>
                <Text style={s.cardLabel}>Taxes (GST)</Text>
                <Text style={s.cardValue}>
                  {format(taxesSummary?.onPaid?.tax || 0)}
                </Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={[s.gridCard, { borderLeftColor: '#6366F1', borderLeftWidth: 4 }]}>
                <View style={[s.iconBg, { backgroundColor: '#EEF2FF' }]}>
                  <Icon name="briefcase" size={15} color="#6366F1" />
                </View>
                <Text style={s.cardLabel}>Service Charge</Text>
                <Text style={s.cardValue}>
                  {format(taxesSummary?.onPaid?.serviceCharge || 0)}
                </Text>
              </View>
              <View style={[s.gridCard, { borderLeftColor: '#F59E0B', borderLeftWidth: 4 }]}>
                <View style={[s.iconBg, { backgroundColor: '#FEF3C7' }]}>
                  <Icon name="smile" size={15} color="#F59E0B" />
                </View>
                <Text style={s.cardLabel}>Tips</Text>
                <Text style={s.cardValue}>
                  {format(taxesSummary?.onPaid?.tip || 0)}
                </Text>
              </View>
            </View>
          </MotiView>

          {/* Dues Position */}
          {hasDues && (
            <MotiView
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 500 }}
              style={{ marginTop: 8, marginBottom: 20 }}
            >
              <Text style={s.sectionLabel}>Dues Position</Text>
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                <View style={[s.gridCard, { borderLeftColor: '#EF4444', borderLeftWidth: 4 }]}>
                  <View style={[s.iconBg, { backgroundColor: '#FEE2E2' }]}>
                    <Icon name="arrow-up-circle" size={15} color="#EF4444" />
                  </View>
                  <Text style={s.cardLabel}>Dues Given</Text>
                  <Text style={[s.cardValue, { color: '#EF4444' }]}>
                    {format(duesSummary?.duesGiven || 0)}
                  </Text>
                </View>
                <View style={[s.gridCard, { borderLeftColor: '#DC2626', borderLeftWidth: 4 }]}>
                  <View style={[s.iconBg, { backgroundColor: '#FEF2F2' }]}>
                    <Icon name="alert-circle" size={15} color="#DC2626" />
                  </View>
                  <Text style={s.cardLabel}>Outstanding</Text>
                  <Text style={[s.cardValue, { color: '#DC2626' }]}>
                    {format(duesSummary?.duesOutstanding || 0)}
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={[s.gridCard, { borderLeftColor: '#64748B', borderLeftWidth: 4 }]}>
                  <View style={[s.iconBg, { backgroundColor: '#F8FAFC' }]}>
                    <Icon name="clock" size={15} color="#64748B" />
                  </View>
                  <Text style={s.cardLabel}>Pending Orders</Text>
                  <Text style={s.cardValue}>
                    {String(duesSummary?.ordersPending || 0)}
                  </Text>
                </View>
                <View style={[s.gridCard, { borderLeftColor: '#10B981', borderLeftWidth: 4 }]}>
                  <View style={[s.iconBg, { backgroundColor: '#ECFDF5' }]}>
                    <Icon name="arrow-down-circle" size={15} color="#10B981" />
                  </View>
                  <Text style={s.cardLabel}>Get Back</Text>
                  <Text style={[s.cardValue, { color: '#10B981' }]}>
                    {format(duesSummary?.duesGetBack || 0)}
                  </Text>
                </View>
              </View>
            </MotiView>
          )}

          {/* Running Tables Grid */}
          {tables.length > 0 && (
            <MotiView
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 600 }}
              style={{ marginTop: 8, marginBottom: 20 }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={[s.sectionLabel, { marginTop: 0, marginBottom: 0 }]}>
                  Active Tables ({tables.length})
                </Text>
                <Text style={{ fontFamily: fonts.bold, fontSize: 13, fontWeight: '800', color: '#D97706' }}>
                  Total: {format(runningTables?.totalActiveTableValue || 0)}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                {tables.map((t, i) => (
                  <MotiView
                    key={`${t.name}-${i}`}
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 300, delay: 600 + i * 40 }}
                    style={{
                      backgroundColor: '#FFFBEB',
                      borderRadius: 16,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      minWidth: 100,
                      borderWidth: 1,
                      borderColor: '#FDE68A',
                      flex: 1,
                      alignItems: 'center',
                      shadowColor: '#D97706',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.05,
                      shadowRadius: 6,
                      elevation: 1,
                    }}
                  >
                    <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: '#B45309', fontWeight: '800', textTransform: 'uppercase', marginBottom: 4 }}>
                      {t.name}
                    </Text>
                    <Text style={{ fontFamily: fonts.bold, fontSize: 15, fontWeight: '900', color: '#78350F' }}>
                      {format(t.amount)}
                    </Text>
                  </MotiView>
                ))}
              </View>
            </MotiView>
          )}
        </>
      )}
      <View style={{ height: 120 }} />
    </ScreenWrapper>
  );
}

const s = {
  sectionLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    fontWeight: '800' as const,
    color: '#64748B',
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    marginTop: 12,
    marginBottom: 10,
  },
  gridCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardLabel: {
    fontFamily: fonts.bold,
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#64748B',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardValue: {
    fontFamily: fonts.bold,
    fontSize: 17,
    fontWeight: '900' as const,
    color: '#0F172A',
  },
};
