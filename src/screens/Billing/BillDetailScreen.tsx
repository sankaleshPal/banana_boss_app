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
import { colors, fonts } from '@/theme';

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
            <Text style={lbl}>Table / Area</Text>
            <Text style={val}>
              {data.tableName || '-'} {data.areaName ? `(${data.areaName})` : ''}
            </Text>
            <AppDivider />
            <Text style={lbl}>Date & Time</Text>
            <Text style={val}>
              {formatDateTime(data.createdAt)}
            </Text>
            <AppDivider />
            <Text style={lbl}>Customer</Text>
            <Text style={val}>
              {data.userName || 'Walk-in'}
            </Text>
            <AppDivider />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <AppBadge label={data.status} variant={data.status === 'PAID' ? 'success' : 'warning'} />
              {data.paymentMethod && <Text style={lbl}>{data.paymentMethod}</Text>}
            </View>
          </AppCard>

          <Text style={{ fontSize: 16, fontFamily: fonts.extrabold, color: colors.text.base, marginTop: 20, marginBottom: 8 }}>
            Items
          </Text>
          {data.items?.map((item: any) => (
            <AppCard key={item._id} style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: colors.text.base, flex: 1 }}>{item.itemName}</Text>
                <Text style={{ fontSize: 14, fontFamily: fonts.bold, color: colors.text.base }}>{format(item.total)}</Text>
              </View>
              <Text style={{ fontSize: 12, fontFamily: fonts.regular, color: colors.text.faint, marginTop: 2 }}>
                {item.quantity} x {format(item.price)}
              </Text>
            </AppCard>
          ))}

          <AppCard style={{ marginTop: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={lbl}>Subtotal</Text>
              <Text style={sumVal}>{format(data.subtotal)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={lbl}>Discount</Text>
              <Text style={[sumVal, { color: colors.danger }]}>{format(data.discount)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={lbl}>Tax</Text>
              <Text style={sumVal}>{format(data.tax)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={lbl}>Service Charge</Text>
              <Text style={sumVal}>{format(data.serviceCharge)}</Text>
            </View>
            <AppDivider />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 18, fontFamily: fonts.extrabold, color: colors.text.base }}>Grand Total</Text>
              <Text style={{ fontSize: 18, fontFamily: fonts.extrabold, color: colors.text.base }}>{format(data.total)}</Text>
            </View>
          </AppCard>
        </View>
      )}
    </ScreenWrapper>
  );
}

const lbl: import('react-native').TextStyle = {
  fontSize: 13,
  fontFamily: fonts.regular,
  color: colors.text.muted,
};

const val: import('react-native').TextStyle = {
  fontSize: 15,
  fontFamily: fonts.bold,
  color: colors.text.base,
  marginTop: 2,
};

const sumVal: import('react-native').TextStyle = {
  fontSize: 14,
  fontFamily: fonts.bold,
  color: colors.text.base,
};
