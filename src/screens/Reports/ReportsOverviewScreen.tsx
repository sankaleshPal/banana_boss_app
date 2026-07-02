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
import { colors, fonts } from '@/theme';

const reportGroups = [
  {
    title: 'Sales & Revenue',
    items: [
      { title: 'Net Sales Summary', icon: 'pie-chart', screen: 'NetSalesSummary' as const, color: colors.tint.sky.bg, iconColor: colors.tint.sky.fg },
      { title: 'Bill-wise Sales', icon: 'file-text', screen: 'BillWiseReport' as const, color: colors.tint.sky.bg, iconColor: colors.tint.sky.fg },
      { title: 'Outstanding Dues', icon: 'user-minus', screen: 'OutstandingDues' as const, color: colors.tint.rose.bg, iconColor: colors.tint.rose.fg },
      { title: 'Discounts Issued', icon: 'percent', screen: 'DiscountReport' as const, color: colors.tint.rose.bg, iconColor: colors.tint.rose.fg },
      { title: 'Service Charge', icon: 'briefcase', screen: 'ServiceChargeReport' as const, color: colors.tint.violet.bg, iconColor: colors.tint.violet.fg },
    ],
  },
  {
    title: 'Menu & Categories',
    items: [
      { title: 'Item Sales', icon: 'shopping-bag', screen: 'ItemSalesReport' as const, color: colors.tint.amber.bg, iconColor: colors.tint.amber.fg },
      { title: 'Category Sales', icon: 'grid', screen: 'CategorySalesReport' as const, color: colors.tint.amber.bg, iconColor: colors.tint.amber.fg },
      { title: 'Parent Category', icon: 'layers', screen: 'ParentCategoryReport' as const, color: colors.tint.amber.bg, iconColor: colors.tint.amber.fg },
      { title: 'Addon Sales', icon: 'plus-circle', screen: 'AddonSalesReport' as const, color: colors.tint.violet.bg, iconColor: colors.tint.violet.fg },
      { title: 'Item Type', icon: 'tag', screen: 'ItemTypeReport' as const, color: colors.tint.sky.bg, iconColor: colors.tint.sky.fg },
      { title: 'Item Variant', icon: 'list', screen: 'ItemVariantReport' as const, color: colors.tint.sky.bg, iconColor: colors.tint.sky.fg },
      { title: 'Open Item Sales', icon: 'unlock', screen: 'OpenItemSales' as const, color: colors.tint.green.bg, iconColor: colors.tint.green.fg },
    ],
  },
  {
    title: 'Audits & Operations',
    items: [
      { title: 'Area Report', icon: 'map-pin', screen: 'AreaReport' as const, color: colors.tint.green.bg, iconColor: colors.tint.green.fg },
      { title: 'Area-Item Sales', icon: 'map', screen: 'AreaItemReport' as const, color: colors.tint.green.bg, iconColor: colors.tint.green.fg },
      { title: 'Table Report', icon: 'layout', screen: 'TableReport' as const, color: colors.tint.green.bg, iconColor: colors.tint.green.fg },
      { title: 'Deleted KOTs', icon: 'trash-2', screen: 'DeletedKotReport' as const, color: colors.tint.rose.bg, iconColor: colors.tint.rose.fg },
      { title: 'Transfer KOTs', icon: 'arrow-right-circle', screen: 'TransferKotReport' as const, color: colors.tint.violet.bg, iconColor: colors.tint.violet.fg },
      { title: 'Transfer Tables', icon: 'shuffle', screen: 'TransferTableReport' as const, color: colors.tint.violet.bg, iconColor: colors.tint.violet.fg },
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
      <TopBar title={currentOutlet?.name || 'Reports'} subtitle="Business Analytics" showBack={false} />

      <View style={{ marginVertical: 8 }}>
        <Text style={{ fontFamily: fonts.semibold, fontSize: 13, color: colors.text.muted, marginBottom: 2 }}>
          Data Insights
        </Text>
        <Text style={{ fontFamily: fonts.extrabold, fontSize: 24, color: colors.text.base }}>
          Reports Hub
        </Text>
      </View>

      <DateRangePicker value={reportsDateRange} onChange={setReportsDateRange} outletId={outletId} />

      {reportGroups.map((group) => (
        <View key={group.title} style={{ marginTop: 22 }}>
          <Text style={{
            fontFamily: fonts.bold,
            fontSize: 11,
            color: colors.text.muted,
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
                  backgroundColor: colors.surface.card,
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
                <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: colors.text.base }}>
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
