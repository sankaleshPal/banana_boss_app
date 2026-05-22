import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BillingStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { usePaymentModesQuery } from '@/queries/paymentMode';
import { useDuesUsersQuery } from '@/queries/duesUser';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { SectionHeader } from '@/components/shared';
import { AppCard } from '@/components/primitives/AppCard';
import Icon from 'react-native-vector-icons/Feather';
import { formatINR } from '@/utils/currency';
import { fonts } from '@/theme';

type Nav = NativeStackNavigationProp<BillingStackParamList>;

const navItems = [
  { title: 'Sales Dashboard', subtitle: 'Analytics & metrics', icon: 'bar-chart-2', screen: 'SalesDashboard' as const, color: '#E0F2FE', iconColor: '#0284C7' },
  { title: 'Billings', subtitle: 'All bills & invoices', icon: 'credit-card', screen: 'BillsList' as const, color: '#FEF3C7', iconColor: '#D97706' },
  { title: 'Payment Modes', subtitle: 'Manage payments', icon: 'dollar-sign', screen: 'PaymentModes' as const, color: '#DCFCE7', iconColor: '#16A34A' },
  { title: 'Dues Ledger', subtitle: 'Outstanding amounts', icon: 'users', screen: 'Dues' as const, color: '#F3E8FF', iconColor: '#9333EA' },
  { title: 'NPC Accounts', subtitle: 'Non-paying registry', icon: 'user-check', screen: 'Npc' as const, color: '#FFE4E6', iconColor: '#E11D48' },
];

export function BillingOverviewScreen() {
  const navigation = useNavigation<Nav>();
  const { outletId, currentOutlet } = useOutlet();
  const { data: paymentModes } = usePaymentModesQuery(outletId);
  const { data: duesUsers } = useDuesUsersQuery(outletId);

  const totalDues = duesUsers?.reduce((sum, u) => sum + (u.currentDuesAmount || 0), 0) || 0;

  return (
    <ScreenWrapper scrollable>
      <TopBar title={currentOutlet?.name || 'Billing Overview'} subtitle="Restaurant Back-Office" />
      
      <View style={{ marginVertical: 8 }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 13, fontWeight: '600', color: '#78716C', marginBottom: 2 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
        </Text>
        <Text style={{ fontFamily: fonts.bold, fontSize: 24, fontWeight: '900', color: '#1A1A1A' }}>
          Overview
        </Text>
      </View>

      <SectionHeader title="Register & Ledgers" />

      <View style={{ gap: 12, marginTop: 4 }}>
        {navItems.map((item, index) => {
          const subtitle =
            item.screen === 'PaymentModes'
              ? `${paymentModes?.length || 0} active modes`
              : item.screen === 'Dues'
              ? `${formatINR(totalDues)} outstanding`
              : item.subtitle;

          return (
            <AppCard
              key={index}
              onPress={() => navigation.navigate(item.screen)}
              style={{
                padding: 18,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: item.color,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                }}
              >
                <Icon name={item.icon} size={22} color={item.iconColor} />
              </View>
              
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 15, fontWeight: '700', color: '#1A1A1A' }}>
                  {item.title}
                </Text>
                <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: '#78716C', marginTop: 3, fontWeight: '500' }}>
                  {subtitle}
                </Text>
              </View>

              <Icon name="arrow-right" size={18} color="#A8A29E" />
            </AppCard>
          );
        })}
      </View>
    </ScreenWrapper>
  );
}
