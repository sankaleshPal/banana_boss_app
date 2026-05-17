import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
import { DateRangePicker } from '@/components/shared';
import Icon from 'react-native-vector-icons/Feather';
import { fonts } from '@/theme';

const reportGroups = [
  {
    title: 'POS Reports',
    items: [
      { title: 'Net Sales Summary',  icon: 'pie-chart',        screen: 'NetSalesSummary'    as const, color: '#FEF9C3' },
      { title: 'Bill-wise Sales',    icon: 'file-text',        screen: 'BillWiseReport'     as const, color: '#FEF9C3' },
      { title: 'Item Sales',         icon: 'shopping-bag',     screen: 'ItemSalesReport'    as const, color: '#D1FAE5' },
      { title: 'Category Sales',     icon: 'grid',             screen: 'CategorySalesReport' as const, color: '#FEF3C7' },
      { title: 'Parent Category',    icon: 'layers',           screen: 'ParentCategoryReport' as const, color: '#FEF3C7' },
      { title: 'Addon Sales',        icon: 'plus-circle',      screen: 'AddonSalesReport'   as const, color: '#EDE9FE' },
      { title: 'Item Type',          icon: 'tag',              screen: 'ItemTypeReport'     as const, color: '#DBEAFE' },
      { title: 'Item Variant',       icon: 'list',             screen: 'ItemVariantReport'  as const, color: '#DBEAFE' },
      { title: 'Area Report',        icon: 'map-pin',          screen: 'AreaReport'         as const, color: '#DBEAFE' },
      { title: 'Area-Item Sales',    icon: 'map',              screen: 'AreaItemReport'     as const, color: '#DBEAFE' },
      { title: 'Discount',           icon: 'percent',          screen: 'DiscountReport'     as const, color: '#FFE4E6' },
      { title: 'Service Charge',     icon: 'briefcase',        screen: 'ServiceChargeReport' as const, color: '#FFE4E6' },
      { title: 'Table Report',       icon: 'layout',           screen: 'TableReport'        as const, color: '#DBEAFE' },
      { title: 'Deleted KOT',        icon: 'trash-2',          screen: 'DeletedKotReport'   as const, color: '#FFE4E6' },
      { title: 'Transfer KOT',       icon: 'arrow-right-circle', screen: 'TransferKotReport' as const, color: '#EDE9FE' },
      { title: 'Transfer Table',     icon: 'shuffle',          screen: 'TransferTableReport' as const, color: '#EDE9FE' },
      { title: 'Outstanding Dues',   icon: 'user-minus',       screen: 'OutstandingDues'    as const, color: '#FFE4E6' },
      { title: 'Open Item Sales',    icon: 'unlock',           screen: 'OpenItemSales'      as const, color: '#D1FAE5' },
    ],
  },
];

export function ReportsOverviewScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ReportsStackParamList>>();
  const { outletId, currentOutlet } = useOutlet();
  const reportsDateRange = useAppStore((s) => s.reportsDateRange);
  const setReportsDateRange = useAppStore((s) => s.setReportsDateRange);

  return (
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <View
        style={{
          backgroundColor: '#0F172A',
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 20,
        }}
      >
        <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: '#CBD5E1', fontWeight: '500', textTransform: 'uppercase' }}>
          Business Insights
        </Text>
        <Text style={{ fontFamily: fonts.bold, fontSize: 26, fontWeight: '700', color: '#FFFFFF', marginTop: 4 }}>
          {currentOutlet?.name || 'Reports'}
        </Text>
        <View style={{ marginTop: 14 }}>
          <DateRangePicker value={reportsDateRange} onChange={setReportsDateRange} outletId={outletId} dark />
        </View>
      </View>

      {/* ── Report Grid ────────────────────────────────────────────── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {reportGroups.map((group) => (
          <View key={group.title} style={{ marginBottom: 8 }}>
            <Text
              style={{
                fontSize: 11,
                fontFamily: fonts.bold,
                fontWeight: '700',
                color: '#64748B',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              {group.title}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {group.items.map((item) => (
                <TouchableOpacity
                  key={item.screen}
                  onPress={() => navigation.navigate(item.screen)}
                  activeOpacity={0.75}
                  style={{
                    width: '47%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 8,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      backgroundColor: item.color,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <Icon name={item.icon} size={18} color="#111827" />
                  </View>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 13, fontWeight: '700', color: '#0F172A' }}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
