import React from 'react';
import { View, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BillingStackParamList } from '@/types/navigation';
import { useBillByIdQuery } from '@/queries/bills';
import { useCurrency } from '@/hooks/useCurrency';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { AppCard, AppDivider, AppBadge } from '@/components/primitives';
import { LoadingSkeleton, ErrorState } from '@/components/shared';
import { formatDateTime } from '@/utils/date';

export function BillDetailScreen() {
  const route = useRoute<RouteProp<BillingStackParamList, 'BillDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<BillingStackParamList>>();
  const { billId } = route.params;
  const { data, isLoading, isError, refetch } = useBillByIdQuery(billId);
  const { format } = useCurrency();

  return (
    <ScreenWrapper scrollable>
      <TopBar title={`Invoice ${data?.invoiceNumber || ''}`} showBack onBack={() => navigation.goBack()} />

      {isLoading && <LoadingSkeleton type="bill-row" count={4} />}
      {isError && <ErrorState onRetry={refetch} />}

      {data && (
        <View style={{ marginTop: 8 }}>
          <AppCard>
            <Text style={{ fontSize: 13, color: '#6B7280' }}>Table / Area</Text>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827', marginTop: 2 }}>
              {data.tableName || '-'} {data.areaName ? `(${data.areaName})` : ''}
            </Text>
            <AppDivider />
            <Text style={{ fontSize: 13, color: '#6B7280' }}>Date & Time</Text>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827', marginTop: 2 }}>
              {formatDateTime(data.createdAt)}
            </Text>
            <AppDivider />
            <Text style={{ fontSize: 13, color: '#6B7280' }}>Customer</Text>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827', marginTop: 2 }}>
              {data.userName || 'Walk-in'}
            </Text>
            <AppDivider />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <AppBadge label={data.status} variant={data.status === 'PAID' ? 'success' : 'warning'} />
              {data.paymentMethod && <Text style={{ fontSize: 13, color: '#6B7280' }}>{data.paymentMethod}</Text>}
            </View>
          </AppCard>

          <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827', marginTop: 20, marginBottom: 8 }}>
            Items
          </Text>
          {data.items?.map((item: any) => (
            <AppCard key={item._id} style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827', flex: 1 }}>{item.itemName}</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>{format(item.total)}</Text>
              </View>
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                {item.quantity} x {format(item.price)}
              </Text>
            </AppCard>
          ))}

          <AppCard style={{ marginTop: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 13, color: '#6B7280' }}>Subtotal</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>{format(data.subtotal)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 13, color: '#6B7280' }}>Discount</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#EF4444' }}>{format(data.discount)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 13, color: '#6B7280' }}>Tax</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>{format(data.tax)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 13, color: '#6B7280' }}>Service Charge</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>{format(data.serviceCharge)}</Text>
            </View>
            <AppDivider />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#111827' }}>Grand Total</Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: '#111827' }}>{format(data.total)}</Text>
            </View>
          </AppCard>
        </View>
      )}
    </ScreenWrapper>
  );
}
