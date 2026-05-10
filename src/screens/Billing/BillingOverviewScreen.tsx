import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BillingStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { usePaymentModesQuery } from '@/queries/paymentMode';
import { useDuesUsersQuery } from '@/queries/duesUser';
import { ScreenWrapper } from '@/components/layout';
import { SectionHeader } from '@/components/shared';
import Icon from 'react-native-vector-icons/Feather';
import { formatINR } from '@/utils/currency';

const navItems = [
  { title: 'Sales Dashboard', subtitle: 'Analytics & metrics', icon: 'bar-chart-2', screen: 'SalesDashboard' as const },
  { title: 'Billings', subtitle: 'All bills & invoices', icon: 'credit-card', screen: 'BillsList' as const },
  { title: 'Payment Modes', subtitle: 'Manage payments', icon: 'dollar-sign', screen: 'PaymentModes' as const },
  { title: 'Dues', subtitle: 'Outstanding amounts', icon: 'users', screen: 'Dues' as const },
];

export function BillingOverviewScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BillingStackParamList>>();
  const { outletId, currentOutlet } = useOutlet();
  const { data: paymentModes } = usePaymentModesQuery(outletId);
  const { data: duesUsers } = useDuesUsersQuery(outletId);

  const totalDues = duesUsers?.reduce((sum, u) => sum + (u.currentDuesAmount || 0), 0) || 0;

  return (
    <ScreenWrapper scrollable>
      <View style={{ paddingVertical: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827' }}>{currentOutlet?.name || 'Billing'}</Text>
        <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
      </View>

      <SectionHeader title="Quick Access" />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {navItems.map((item, index) => {
          const subtitle =
            item.screen === 'PaymentModes'
              ? `${paymentModes?.length || 0} modes`
              : item.screen === 'Dues'
              ? formatINR(totalDues)
              : item.subtitle;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(item.screen)}
              style={{
                width: '47%',
                backgroundColor: '#FFFFFF',
                borderRadius: 14,
                padding: 16,
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.06)',
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: '#FDE047',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                }}
              >
                <Icon name={item.icon} size={20} color="#111827" />
              </View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>{item.title}</Text>
              <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>{subtitle}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScreenWrapper>
  );
}
