import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ReportsStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
import { ScreenWrapper } from '@/components/layout';
import { DateRangePicker } from '@/components/shared';
import Icon from 'react-native-vector-icons/Feather';

const reportGroups = [
  {
    title: 'POS Reports',
    items: [
      { title: 'Net Sales Summary', icon: 'pie-chart', screen: 'NetSalesSummary' as const, color: '#FDE047' },
      { title: 'Bill-wise Sales', icon: 'file-text', screen: 'BillWiseReport' as const, color: '#FDE047' },
      { title: 'Item Sales', icon: 'shopping-bag', screen: 'ItemSalesReport' as const, color: '#D1FAE5' },
      { title: 'Category Sales', icon: 'grid', screen: 'CategorySalesReport' as const, color: '#FEF3C7' },
      { title: 'Parent Category', icon: 'layers', screen: 'ParentCategoryReport' as const, color: '#FEF3C7' },
      { title: 'Addon Sales', icon: 'plus-circle', screen: 'AddonSalesReport' as const, color: '#E9D5FF' },
      { title: 'Item Type', icon: 'tag', screen: 'ItemTypeReport' as const, color: '#DBEAFE' },
      { title: 'Item Variant', icon: 'list', screen: 'ItemVariantReport' as const, color: '#DBEAFE' },
      { title: 'Area Report', icon: 'map-pin', screen: 'AreaReport' as const, color: '#DBEAFE' },
      { title: 'Area-Item Sales', icon: 'map', screen: 'AreaItemReport' as const, color: '#DBEAFE' },
      { title: 'Discount', icon: 'percent', screen: 'DiscountReport' as const, color: '#FFE4E6' },
      { title: 'Service Charge', icon: 'briefcase', screen: 'ServiceChargeReport' as const, color: '#FFE4E6' },
      { title: 'Table Report', icon: 'layout', screen: 'TableReport' as const, color: '#DBEAFE' },
      { title: 'Deleted KOT', icon: 'trash-2', screen: 'DeletedKotReport' as const, color: '#FFE4E6' },
      { title: 'Transfer KOT', icon: 'arrow-right-circle', screen: 'TransferKotReport' as const, color: '#E9D5FF' },
      { title: 'Transfer Table', icon: 'shuffle', screen: 'TransferTableReport' as const, color: '#E9D5FF' },
      { title: 'Outstanding Dues', icon: 'user-minus', screen: 'OutstandingDues' as const, color: '#FFE4E6' },
      { title: 'Open Item Sales', icon: 'unlock', screen: 'OpenItemSales' as const, color: '#D1FAE5' },
    ],
  },
];

export function ReportsOverviewScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ReportsStackParamList>>();
  const { currentOutlet } = useOutlet();
  const reportsDateRange = useAppStore((s) => s.reportsDateRange);
  const setReportsDateRange = useAppStore((s) => s.setReportsDateRange);

  return (
    <ScreenWrapper scrollable>
      <View style={{ paddingVertical: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827' }}>Business Insights</Text>
        <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{currentOutlet?.name}</Text>
      </View>

      <DateRangePicker value={reportsDateRange} onChange={setReportsDateRange} />

      {reportGroups.map((group) => (
        <View key={group.title} style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 11, fontWeight: '800', color: '#9CA3AF', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
            {group.title}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {group.items.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => navigation.navigate(item.screen)}
                style={{
                  width: '47%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 14,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.06)',
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: item.color,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}
                >
                  <Icon name={item.icon} size={18} color="#111827" />
                </View>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827' }}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </ScreenWrapper>
  );
}
