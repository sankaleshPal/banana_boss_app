import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BillingStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
import { useBillsListQuery } from '@/queries/bills';
import { useCurrency } from '@/hooks/useCurrency';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { DateRangePicker, StatusBadge, SearchBar, LoadingSkeleton, EmptyState, ErrorState } from '@/components/shared';
import { formatDateTime } from '@/utils/date';
import { AppCard } from '@/components/primitives/AppCard';
import Icon from 'react-native-vector-icons/Feather';

// Enable layout animations for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function BillsListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BillingStackParamList>>();
  const { outletId } = useOutlet();
  const dateRange = useAppStore((s) => s.billingDateRange);
  const setDateRange = useAppStore((s) => s.setBillingDateRange);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { format } = useCurrency();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const { data, isLoading, isError, refetch } = useBillsListQuery(
    outletId,
    dateRange.from,
    dateRange.to,
    page,
    50, // Fetch more to allow solid grouping
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return data?.data || [];
    const q = search.toLowerCase();
    return (data?.data || []).filter(
      (b) =>
        b.invoiceNumber?.toLowerCase().includes(q) ||
        b.userName?.toLowerCase().includes(q) ||
        b.tableName?.toLowerCase().includes(q),
    );
  }, [data, search]);

  // Calculate Metrics - Dues are ledger entries (re-payments/balances) and excluded to prevent double counting
  const metrics = useMemo(() => {
    let salesTotal = 0;
    let duesTotal = 0;
    let regularBillsCount = 0;

    filtered.forEach((b: any) => {
      const isDues = b.paymentMethod === 'DUES' || b.isDuesSettlement === true;
      if (isDues) {
        duesTotal += b.total || 0;
      } else {
        salesTotal += b.total || 0;
        // Don't double count children in bills count
        if (!b.parentId) {
          regularBillsCount++;
        }
      }
    });

    return { salesTotal, duesTotal, regularBillsCount };
  }, [filtered]);

  // Group split child bills under their parent transactions
  const groupedBills = useMemo(() => {
    const childrenMap: Record<string, any[]> = {};
    const list: any[] = [];

    // First pass: map children to parent IDs
    filtered.forEach((b: any) => {
      if (b.parentId) {
        if (!childrenMap[b.parentId]) {
          childrenMap[b.parentId] = [];
        }
        childrenMap[b.parentId].push(b);
      }
    });

    // Second pass: construct top-level list
    filtered.forEach((b: any) => {
      if (b.parentId) {
        // Orphaned split children (parent not in this page/filter)
        const parentExists = filtered.some((p: any) => p._id === b.parentId);
        if (!parentExists) {
          list.push({
            ...b,
            isOrphanChild: true,
          });
        }
        return;
      }

      const children = childrenMap[b._id] || [];
      list.push({
        ...b,
        isParent: children.length > 0,
        children,
      });
    });

    return list;
  }, [filtered]);

  const toggleGroup = useCallback((parentId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedGroups((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  }, []);

  const renderBillRow = useCallback(
    (item: any, isChild = false) => {
      const isDues = item.paymentMethod === 'DUES' || item.isDuesSettlement === true;
      
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('BillDetail', { billId: item._id })}
          activeOpacity={0.7}
          style={{
            backgroundColor: isChild ? '#F5F3EF' : '#FFFFFF',
            borderRadius: isChild ? 16 : 20,
            padding: 16,
            marginBottom: isChild ? 6 : 10,
            borderWidth: 1,
            borderColor: isDues ? '#EAE8E2' : isChild ? 'rgba(0,0,0,0.02)' : '#EAE8E2',
            shadowColor: '#1A1A1A',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isChild ? 0 : 0.02,
            shadowRadius: 8,
            elevation: isChild ? 0 : 1,
            marginLeft: isChild ? 20 : 0,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A1A1A' }}>
                  {item.invoiceNumber}
                </Text>
                {isDues && (
                  <View style={{
                    backgroundColor: '#F5F3EF',
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#EAE8E2',
                  }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#78716C' }}>
                      DUES ADJUSTMENT
                    </Text>
                  </View>
                )}
                {item.isSplit && !isChild && (
                  <View style={{
                    backgroundColor: '#FEF3C7',
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#FDE68A',
                  }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#B45309' }}>
                      SPLIT GROUP
                    </Text>
                  </View>
                )}
              </View>
              <Text style={{ fontSize: 11, color: '#A8A29E', marginTop: 4 }}>
                {formatDateTime(item.createdAt)}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: isDues ? '#78716C' : '#1A1A1A' }}>
                {format(item.total)}
              </Text>
              {isDues && (
                <Text style={{ fontSize: 10, color: '#A8A29E', marginTop: 2, fontWeight: '500' }}>
                  Excluded from Revenue
                </Text>
              )}
            </View>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <StatusBadge status={item.status} />
              {item.paymentMethod && !isDues && (
                <Text style={{ fontSize: 11, color: '#78716C', fontWeight: '500' }}>{item.paymentMethod}</Text>
              )}
              {item.tableName && (
                <Text style={{ fontSize: 11, color: '#78716C', fontWeight: '500' }}>Table {item.tableName}</Text>
              )}
            </View>

            {item.isParent && (
              <TouchableOpacity 
                onPress={() => toggleGroup(item._id)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8 }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#D97706' }}>
                  {item.children.length} Splits
                </Text>
                <Icon 
                  name={expandedGroups[item._id] ? 'chevron-up' : 'chevron-down'} 
                  size={14} 
                  color="#D97706" 
                />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [navigation, format, expandedGroups, toggleGroup],
  );

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      const isExpanded = !!expandedGroups[item._id];
      return (
        <View style={{ marginBottom: 6 }}>
          {renderBillRow(item)}
          {item.isParent && isExpanded && (
            <View style={{ marginTop: 2 }}>
              {item.children.map((child: any) => (
                <React.Fragment key={child._id}>
                  {renderBillRow(child, true)}
                </React.Fragment>
              ))}
            </View>
          )}
        </View>
      );
    },
    [renderBillRow, expandedGroups],
  );

  return (
    <ScreenWrapper>
      <TopBar title="Bills" showBack onBack={() => navigation.goBack()} />
      {/* Dynamic Filter Section */}
      <View style={{ marginVertical: 8 }}>
        <DateRangePicker value={dateRange} onChange={(r) => { setDateRange(r); setPage(1); }} outletId={outletId} />
        <SearchBar value={search} onChange={setSearch} placeholder="Search invoice, customer, table..." />
      </View>

      {/* Sales metrics summary card */}
      {!isLoading && !isError && filtered.length > 0 && (
        <AppCard style={{ marginBottom: 16, backgroundColor: '#FFFFFF', padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontFamily: fonts.bold, fontSize: 11, fontWeight: '800', color: '#A8A29E', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Total Revenue
              </Text>
              <Text style={{ fontFamily: fonts.bold, fontSize: 20, fontWeight: '900', color: '#1A1A1A', marginTop: 4 }}>
                {format(metrics.salesTotal)}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 11, fontWeight: '800', color: '#A8A29E', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Bills / Dues
              </Text>
              <Text style={{ fontFamily: fonts.medium, fontSize: 14, fontWeight: '700', color: '#44403C', marginTop: 4 }}>
                {metrics.regularBillsCount} bills | Dues {format(metrics.duesTotal)}
              </Text>
            </View>
          </View>
        </AppCard>
      )}

      {isLoading && <LoadingSkeleton type="bill-row" count={6} />}
      {isError && <ErrorState onRetry={refetch} />}

      <FlatList
        data={groupedBills}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyState title="No bills found" subtitle="Try adjusting the date range or filters." />}
        contentContainerStyle={{ paddingBottom: 120 }} // Keep spacer for floating bottom tabs
        showsVerticalScrollIndicator={false}
      />

      {data && Math.ceil((data.total || 0) / (data.limit || 20)) > 1 && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16 }}>
          <TouchableOpacity
            onPress={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            style={{ padding: 8, opacity: page <= 1 ? 0.4 : 1 }}
          >
            <Icon name="chevron-left" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={{ fontFamily: fonts.bold, marginHorizontal: 12, fontSize: 13, fontWeight: '700', color: '#1A1A1A' }}>
            Page {page} of {Math.ceil((data.total || 0) / (data.limit || 20))}
          </Text>
          <TouchableOpacity
            onPress={() => setPage((p) => Math.min(Math.ceil((data.total || 0) / (data.limit || 20)), p + 1))}
            disabled={page >= Math.ceil((data.total || 0) / (data.limit || 20))}
            style={{ padding: 8, opacity: page >= Math.ceil((data.total || 0) / (data.limit || 20)) ? 0.4 : 1 }}
          >
            <Icon name="chevron-right" size={20} color="#1A1A1A" />
          </TouchableOpacity>
        </View>
      )}
    </ScreenWrapper>
  );
}

