import React, { useState } from 'react';
import { View, Text, FlatList, Switch, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BillingStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { usePaymentModesQuery, useUpdatePaymentModeMutation } from '@/queries/paymentMode';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { AppCard, AppInput, AppButton } from '@/components/primitives';
import { LoadingSkeleton, EmptyState, ErrorState } from '@/components/shared';
import Icon from 'react-native-vector-icons/Feather';

export function PaymentModesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BillingStackParamList>>();
  const { outletId } = useOutlet();
  const { data, isLoading, isError, refetch } = usePaymentModesQuery(outletId);
  const updateMutation = useUpdatePaymentModeMutation(outletId);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');

  const toggleStatus = (id: string, current: boolean) => {
    updateMutation.mutate({ id, payload: { status: !current } });
  };

  return (
    <ScreenWrapper>
      <TopBar title="Payment Modes" showBack onBack={() => navigation.goBack()} />

      {isLoading && <LoadingSkeleton type="card-grid" count={6} />}
      {isError && <ErrorState onRetry={refetch} />}

      <FlatList
        data={data || []}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <AppCard style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827' }}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: '#9CA3AF' }}>{item.status ? 'Active' : 'Inactive'}</Text>
            </View>
            <Switch
              value={item.status}
              onValueChange={() => toggleStatus(item._id, item.status)}
              trackColor={{ false: '#E5E7EB', true: '#FDE047' }}
              thumbColor={item.status ? '#111827' : '#9CA3AF'}
            />
          </AppCard>
        )}
        ListEmptyComponent={<EmptyState title="No payment modes" subtitle="Add a payment mode to get started." />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {showAdd && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', padding: 16, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' }}>
          <AppInput label="Mode Name" placeholder="e.g. UPI" value={newName} onChangeText={setNewName} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <AppButton label="Cancel" onPress={() => setShowAdd(false)} variant="ghost" style={{ flex: 1 }} />
            <AppButton label="Save" onPress={() => setShowAdd(false)} style={{ flex: 1 }} />
          </View>
        </View>
      )}

      <TouchableOpacity
        onPress={() => setShowAdd(true)}
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#111827',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <Icon name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </ScreenWrapper>
  );
}
