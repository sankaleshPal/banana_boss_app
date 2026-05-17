import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BillingStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { usePaymentModesQuery } from '@/queries/paymentMode';
import { useDuesUsersQuery } from '@/queries/duesUser';
import Icon from 'react-native-vector-icons/Feather';
import { formatINR } from '@/utils/currency';

type Nav = NativeStackNavigationProp<BillingStackParamList>;

const navItems = [
  { title: 'Sales',        subtitle: 'Analytics & metrics',  icon: 'trending-up',   screen: 'SalesDashboard' as const, color: '#FEF9C3' },
  { title: 'Billings',     subtitle: 'All bills & invoices',  icon: 'file-text',     screen: 'BillsList'      as const, color: '#DBEAFE' },
  { title: 'Payments',     subtitle: 'Payment modes',         icon: 'credit-card',   screen: 'PaymentModes'   as const, color: '#D1FAE5' },
  { title: 'Dues',         subtitle: 'Outstanding amounts',   icon: 'users',         screen: 'Dues'           as const, color: '#FFE4E6' },
  { title: 'NPC',          subtitle: 'No payment collected',  icon: 'x-circle',      screen: 'Npc'            as const, color: '#EDE9FE' },
];

export function BillingOverviewScreen() {
  const navigation = useNavigation<Nav>();
  const { outletId, currentOutlet } = useOutlet();
  const { data: paymentModes } = usePaymentModesQuery(outletId);
  const { data: duesUsers } = useDuesUsersQuery(outletId);

  const totalDues = duesUsers?.reduce((sum, u) => sum + (u.currentDuesAmount || 0), 0) || 0;

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      {/* ── Header ───────────────────────────────────────────────────── */}
      <View
        style={{
          backgroundColor: '#111827',
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 24,
        }}
      >
        <Text style={{ fontSize: 11, color: '#9CA3AF', fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase' }}>
          {today}
        </Text>
        <Text style={{ fontSize: 26, fontWeight: '900', color: '#FFFFFF', marginTop: 4, letterSpacing: -0.5 }}>
          {currentOutlet?.name || 'Billing'}
        </Text>
      </View>

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: '800',
            color: '#9CA3AF',
            letterSpacing: 1,
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          Quick Access
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {navItems.map((item) => {
            const subtitle =
              item.screen === 'PaymentModes'
                ? `${paymentModes?.length || 0} modes`
                : item.screen === 'Dues'
                ? formatINR(totalDues)
                : item.subtitle;

            return (
              <TouchableOpacity
                key={item.screen}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.75}
                style={{
                  width: '47%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  padding: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.06,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    backgroundColor: item.color,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                >
                  <Icon name={item.icon} size={20} color="#111827" />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>{item.title}</Text>
                <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 3 }}>{subtitle}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
