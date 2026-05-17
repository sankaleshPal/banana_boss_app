import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
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
import Icon from 'react-native-vector-icons/Feather';

export function BillsListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BillingStackParamList>>();
  const { outletId } = useOutlet();
  const dateRange = useAppStore((s) => s.billingDateRange);
  const setDateRange = useAppStore((s) => s.setBillingDateRange);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { format } = useCurrency();

  const { data, isLoading, isError, refetch } = useBillsListQuery(
    outletId,
    dateRange.from,
    dateRange.to,
    page,
    20,
  );

  const filtered = React.useMemo(() => {
    if (!search.trim()) return data?.data || [];
    const q = search.toLowerCase();
    return (data?.data || []).filter(
      (b) =>
        b.invoiceNumber?.toLowerCase().includes(q) ||
        b.userName?.toLowerCase().includes(q) ||
        b.tableName?.toLowerCase().includes(q),
    );
  }, [data, search]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <TouchableOpacity
        onPress={() => navigation.navigate('BillDetail', { billId: item._id })}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 14,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.05)',
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>{item.invoiceNumber}</Text>
            <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
              {formatDateTime(item.createdAt)}
            </Text>
          </View>
          <Text style={{ fontSize: 16, fontWeight: '900', color: '#111827' }}>{format(item.total)}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 }}>
          <StatusBadge status={item.status} />
          {item.paymentMethod && (
            <Text style={{ fontSize: 11, color: '#6B7280' }}>{item.paymentMethod}</Text>
          )}
          {item.tableName && (
            <Text style={{ fontSize: 11, color: '#6B7280' }}>{item.tableName}</Text>
          )}
        </View>
      </TouchableOpacity>
    ),
    [navigation, format],
  );

  return (
    <ScreenWrapper>
      <TopBar title="Bills" showBack onBack={() => navigation.goBack()} />
      <DateRangePicker value={dateRange} onChange={(r) => { setDateRange(r); setPage(1); }} outletId={outletId} />
      <SearchBar value={search} onChange={setSearch} placeholder="Search invoice, customer, table..." />

      {isLoading && <LoadingSkeleton type="bill-row" count={6} />}
      {isError && <ErrorState onRetry={refetch} />}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={<EmptyState title="No bills found" subtitle="Try adjusting the date range or filters." />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      {data && Math.ceil((data.total || 0) / (data.limit || 20)) > 1 && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12 }}>
          <TouchableOpacity
            onPress={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            style={{ padding: 8, opacity: page <= 1 ? 0.4 : 1 }}
          >
            <Icon name="chevron-left" size={20} color="#111827" />
          </TouchableOpacity>
          <Text style={{ marginHorizontal: 12, fontSize: 13, fontWeight: '700' }}>
            Page {page} of {Math.ceil((data.total || 0) / (data.limit || 20))}
          </Text>
          <TouchableOpacity
            onPress={() => setPage((p) => Math.min(Math.ceil((data.total || 0) / (data.limit || 20)), p + 1))}
            disabled={page >= Math.ceil((data.total || 0) / (data.limit || 20))}
            style={{ padding: 8, opacity: page >= Math.ceil((data.total || 0) / (data.limit || 20)) ? 0.4 : 1 }}
          >
            <Icon name="chevron-right" size={20} color="#111827" />
          </TouchableOpacity>
        </View>
      )}
    </ScreenWrapper>
  );
}
