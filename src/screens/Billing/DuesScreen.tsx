import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BillingStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useDuesUsersQuery } from '@/queries/duesUser';
import { useCurrency } from '@/hooks/useCurrency';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { AppCard, AppBadge } from '@/components/primitives';
import { LoadingSkeleton, EmptyState, ErrorState } from '@/components/shared';

export function DuesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BillingStackParamList>>();
  const { outletId } = useOutlet();
  const { data, isLoading, isError, refetch } = useDuesUsersQuery(outletId);
  const { format } = useCurrency();

  return (
    <ScreenWrapper>
      <TopBar title="Dues" showBack onBack={() => navigation.goBack()} />

      {isLoading && <LoadingSkeleton type="card-grid" count={6} />}
      {isError && <ErrorState onRetry={refetch} />}

      <FlatList
        data={data || []}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <AppCard style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#374151' }}>
                {item.name?.substring(0, 2)?.toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827' }}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF' }}>{item.phone || 'No phone'}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 15, fontWeight: '900', color: '#EF4444' }}>{format(item.currentDuesAmount)}</Text>
              <AppBadge label={item.status ? 'Active' : 'Inactive'} variant={item.status ? 'success' : 'neutral'} size="sm" />
            </View>
          </AppCard>
        )}
        ListEmptyComponent={<EmptyState title="No dues users" subtitle="Add customers with outstanding dues." />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </ScreenWrapper>
  );
}
