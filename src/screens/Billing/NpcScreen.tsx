import React, { useState } from 'react';
import { View, Text, FlatList, Modal, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BillingStackParamList } from '@/types/navigation';
import { useOutlet } from '@/hooks/useOutlet';
import { useNpcUsersQuery, useCreateNpcUserMutation } from '@/queries/npcUser';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { AppCard } from '@/components/primitives/AppCard';
import { AppButton } from '@/components/primitives/AppButton';
import { AppInput } from '@/components/primitives/AppInput';
import { LoadingSkeleton, EmptyState, ErrorState } from '@/components/shared';
import Icon from 'react-native-vector-icons/Feather';
import { formatDateTime } from '@/utils/date';

export function NpcScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<BillingStackParamList>>();
  const { outletId } = useOutlet();
  const { data, isLoading, isError, refetch } = useNpcUsersQuery(outletId);
  const createMutation = useCreateNpcUserMutation(outletId);

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleAddNpcUser = async () => {
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
      });

      setModalVisible(false);
      setName('');
      setPhone('');
      Alert.alert('Success', 'NPC profile created successfully.');
    } catch (err: any) {
      setError(err?.message || 'Failed to create NPC profile.');
    }
  };

  return (
    <ScreenWrapper>
      <TopBar 
        title="NPC Accounts" 
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
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF' }}>Add NPC</Text>
          </TouchableOpacity>
        }
      />

      <View style={{ marginVertical: 8, paddingHorizontal: 4 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#78716C' }}>
          Non-Paying Complimentary Registry
        </Text>
      </View>

      {isLoading && <LoadingSkeleton type="bill-row" count={4} />}
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
              backgroundColor: '#FFE4E6', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#FFE4E6',
            }}>
              <Icon name="user-check" size={20} color="#E11D48" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#1A1A1A' }}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: '#78716C', marginTop: 3, fontWeight: '500' }}>
                {item.phone || 'No Phone'}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 11, color: '#A8A29E', fontWeight: '500' }}>
                Created
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#44403C', marginTop: 2 }}>
                {item.createdAt ? formatDateTime(new Date(item.createdAt).getTime()).split(',')[0] : 'N/A'}
              </Text>
            </View>
          </AppCard>
        )}
        ListEmptyComponent={<EmptyState title="No NPC Registry Profiles" subtitle="Add Complimentary accounts for special guests." />}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Add NPC User Modal */}
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
                Add NPC Account
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 4 }}>
                <Icon name="x" size={22} color="#1A1A1A" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <AppInput
                label="Guest / Account Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter guest or account name"
                autoCapitalize="words"
              />

              <AppInput
                label="Phone Number (Optional)"
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
                  label="Create Account"
                  variant="primary"
                  onPress={handleAddNpcUser}
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
