import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { DateRangePicker } from '@/components/shared';
import { AppCard } from '@/components/primitives/AppCard';
import Icon from 'react-native-vector-icons/Feather';
import { fonts } from '@/theme';

const reportGroups = [
  {
    title: 'Sales & Revenue',
    items: [
      { title: 'Net Sales Summary', icon: 'pie-chart', screen: 'NetSalesSummary' as const, color: '#E0F2FE', iconColor: '#0284C7' },
      { title: 'Bill-wise Sales', icon: 'file-text', screen: 'BillWiseReport' as const, color: '#E0F2FE', iconColor: '#0284C7' },
      { title: 'Outstanding Dues', icon: 'user-minus', screen: 'OutstandingDues' as const, color: '#FFE4E6', iconColor: '#E11D48' },
      { title: 'Discounts Issued', icon: 'percent', screen: 'DiscountReport' as const, color: '#FFE4E6', iconColor: '#E11D48' },
      { title: 'Service Charge', icon: 'briefcase', screen: 'ServiceChargeReport' as const, color: '#F3E8FF', iconColor: '#9333EA' },
    ],
  },
  {
    title: 'Menu & Categories',
    items: [
      { title: 'Item Sales', icon: 'shopping-bag', screen: 'ItemSalesReport' as const, color: '#FEF3C7', iconColor: '#D97706' },
      { title: 'Category Sales', icon: 'grid', screen: 'CategorySalesReport' as const, color: '#FEF3C7', iconColor: '#D97706' },
      { title: 'Parent Category', icon: 'layers', screen: 'ParentCategoryReport' as const, color: '#FEF3C7', iconColor: '#D97706' },
      { title: 'Addon Sales', icon: 'plus-circle', screen: 'AddonSalesReport' as const, color: '#F3E8FF', iconColor: '#9333EA' },
      { title: 'Item Type', icon: 'tag', screen: 'ItemTypeReport' as const, color: '#E0F2FE', iconColor: '#0284C7' },
      { title: 'Item Variant', icon: 'list', screen: 'ItemVariantReport' as const, color: '#E0F2FE', iconColor: '#0284C7' },
      { title: 'Open Item Sales', icon: 'unlock', screen: 'OpenItemSales' as const, color: '#DCFCE7', iconColor: '#16A34A' },
    ],
  },
  {
    title: 'Audits & Operations',
    items: [
      { title: 'Area Report', icon: 'map-pin', screen: 'AreaReport' as const, color: '#DCFCE7', iconColor: '#16A34A' },
      { title: 'Area-Item Sales', icon: 'map', screen: 'AreaItemReport' as const, color: '#DCFCE7', iconColor: '#16A34A' },
      { title: 'Table Report', icon: 'layout', screen: 'TableReport' as const, color: '#DCFCE7', iconColor: '#16A34A' },
      { title: 'Deleted KOTs', icon: 'trash-2', screen: 'DeletedKotReport' as const, color: '#FFE4E6', iconColor: '#E11D48' },
      { title: 'Transfer KOTs', icon: 'arrow-right-circle', screen: 'TransferKotReport' as const, color: '#F3E8FF', iconColor: '#9333EA' },
      { title: 'Transfer Tables', icon: 'shuffle', screen: 'TransferTableReport' as const, color: '#F3E8FF', iconColor: '#9333EA' },
    ],
  },
];

export function ReportsOverviewScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ReportsStackParamList>>();
  const { outletId, currentOutlet } = useOutlet();
  const reportsDateRange = useAppStore((s) => s.reportsDateRange);
  const setReportsDateRange = useAppStore((s) => s.setReportsDateRange);

  return (
    <ScreenWrapper scrollable>
      <TopBar title={currentOutlet?.name || 'Reports'} subtitle="Business Analytics" />

      <View style={{ marginVertical: 8 }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 13, fontWeight: '600', color: '#78716C', marginBottom: 2 }}>
          Data Insights
        </Text>
        <Text style={{ fontFamily: fonts.bold, fontSize: 24, fontWeight: '900', color: '#1A1A1A' }}>
          Reports Hub
        </Text>
      </View>

      <DateRangePicker value={reportsDateRange} onChange={setReportsDateRange} outletId={outletId} />

      {reportGroups.map((group) => (
        <View key={group.title} style={{ marginTop: 22 }}>
          <Text style={{ 
            fontFamily: fonts.bold,
            fontSize: 11, 
            fontWeight: '800', 
            color: '#78716C', 
            letterSpacing: 0.8, 
            textTransform: 'uppercase', 
            marginBottom: 12,
            paddingHorizontal: 4 
          }}>
            {group.title}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {group.items.map((item, idx) => (
              <AppCard
                key={idx}
                onPress={() => navigation.navigate(item.screen)}
                style={{
                  flex: 1,
                  minWidth: 140,
                  maxWidth: '48%',
                  backgroundColor: '#FFFFFF',
                  padding: 12,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: item.color,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                  }}
                >
                  <Icon name={item.icon} size={20} color={item.iconColor} />
                </View>
                <Text style={{ fontFamily: fonts.bold, fontSize: 13, fontWeight: '700', color: '#1A1A1A' }}>
                  {item.title}
                </Text>
              </AppCard>
            ))}
          </View>
        </View>
      ))}

      <View style={{ height: 120 }} />
    </ScreenWrapper>
  );
}
