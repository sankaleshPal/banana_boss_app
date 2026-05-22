import React, { useState } from 'react';
import { View, Text, FlatList, Modal, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BillingStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useDuesUsersQuery, useCreateDuesUserMutation } from '@/queries/duesUser';
import { useCurrency } from '@/hooks/useCurrency';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { AppCard } from '@/components/primitives/AppCard';
import { AppButton } from '@/components/primitives/AppButton';
import { AppInput } from '@/components/primitives/AppInput';
import { LoadingSkeleton, EmptyState, ErrorState } from '@/components/shared';
import Icon from 'react-native-vector-icons/Feather';

export function DuesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BillingStackParamList>>();
  const { outletId } = useOutlet();
  const { data, isLoading, isError, refetch } = useDuesUsersQuery(outletId);
  const createMutation = useCreateDuesUserMutation(outletId);
  const { format } = useCurrency();

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleAddDueUser = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setError('');

    try {
      await createMutation.mutateAsync({
        outletId: outletId!,
        name: name.trim(),
        phone: phone.trim() || undefined,
        status: true,
        currentDuesAmount: 0,
      });

      setModalVisible(false);
      setName('');
      setPhone('');
      Alert.alert('Success', 'Dues profile created successfully.');
    } catch (err: any) {
      setError(err?.message || 'Failed to create dues profile.');
    }
  };

  return (
    <ScreenWrapper>
      <TopBar 
        title="Dues Ledger" 
        showBack 
        onBack={() => navigation.goBack()} 
        rightActions={
          <TouchableOpacity 
            onPress={() => setModalVisible(true)}
            style={{
              backgroundColor: '#1A1A1A',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
            activeOpacity={0.8}
          >
            <Icon name="plus" size={14} color="#FFFFFF" />
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF' }}>Add User</Text>
          </TouchableOpacity>
        }
      />

      <View style={{ marginVertical: 8, paddingHorizontal: 4 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#78716C' }}>
          Outstanding Balances
        </Text>
      </View>

      {isLoading && <LoadingSkeleton type="card-grid" count={6} />}
      {isError && <ErrorState onRetry={refetch} />}

      <FlatList
        data={data || []}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <AppCard style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
            <View style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 14, 
              backgroundColor: '#F5F3EF', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#EAE8E2',
            }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#44403C' }}>
                {item.name?.substring(0, 2)?.toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#1A1A1A' }}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: '#78716C', marginTop: 3, fontWeight: '500' }}>{item.phone || 'No Phone'}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: item.currentDuesAmount > 0 ? '#E05252' : '#16A34A' }}>
                {format(item.currentDuesAmount)}
              </Text>
              <View style={{
                marginTop: 4,
                backgroundColor: item.status ? '#DCFCE7' : '#F5F3EF',
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: item.status ? '#BBF7D0' : '#EAE8E2',
              }}>
                <Text style={{ fontSize: 9, fontWeight: '700', color: item.status ? '#16A34A' : '#78716C' }}>
                  {item.status ? 'ACTIVE' : 'INACTIVE'}
                </Text>
              </View>
            </View>
          </AppCard>
        )}
        ListEmptyComponent={<EmptyState title="No Dues Accounts" subtitle="Add customer profiles to manage outstanding dues." />}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Dues User Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}>
          <View style={{
            backgroundColor: '#FAF9F6',
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 24,
            maxHeight: '80%',
            borderTopWidth: 1,
            borderColor: '#EAE8E2',
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#1A1A1A' }}>
                Add Dues Profile
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 4 }}>
                <Icon name="x" size={22} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <AppInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter customer name"
                autoCapitalize="words"
              />

              <AppInput
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter 10-digit number"
                keyboardType="phone-pad"
              />

              {error ? (
                <Text style={{ color: '#E05252', fontSize: 13, fontWeight: '600', marginBottom: 16 }}>
                  {error}
                </Text>
              ) : null}

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 12, marginBottom: 24 }}>
                <AppButton
                  label="Cancel"
                  variant="secondary"
                  onPress={() => setModalVisible(false)}
                  style={{ flex: 1 }}
                />
                <AppButton
                  label="Create Profile"
                  variant="primary"
                  onPress={handleAddDueUser}
                  loading={createMutation.isPending}
                  style={{ flex: 1 }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
}
