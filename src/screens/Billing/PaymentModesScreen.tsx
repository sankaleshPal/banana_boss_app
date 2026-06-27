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
import { colors, fonts, radii, shadows } from '@/theme';

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
              <Text style={{ fontSize: 15, fontFamily: fonts.bold, color: colors.text.base }}>{item.name}</Text>
              <Text style={{ fontSize: 12, fontFamily: fonts.regular, color: colors.text.faint }}>{item.status ? 'Active' : 'Inactive'}</Text>
            </View>
            <Switch
              value={item.status}
              onValueChange={() => toggleStatus(item._id, item.status)}
              trackColor={{ false: colors.surface.border, true: colors.primary }}
              thumbColor={item.status ? colors.primaryDark : colors.text.faint}
            />
          </AppCard>
        )}
        ListEmptyComponent={<EmptyState title="No payment modes" subtitle="Add a payment mode to get started." />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {showAdd && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface.card, padding: 16, borderTopWidth: 1, borderTopColor: colors.surface.borderSoft }}>
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
          borderRadius: radii.full,
          backgroundColor: colors.primaryDark,
          alignItems: 'center',
          justifyContent: 'center',
          ...shadows.button,
        }}
      >
        <Icon name="plus" size={24} color={colors.text.white} />
      </TouchableOpacity>
    </ScreenWrapper>
  );
}
