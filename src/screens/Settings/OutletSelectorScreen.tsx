import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/types/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import { queryClient } from '@/queries/queryClient';
import { ScreenWrapper, TopBar } from '@/components/layout';
import { AppCard } from '@/components/primitives';
import Icon from 'react-native-vector-icons/Feather';

export function OutletSelectorScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();
  const outlets = useAuthStore((s) => s.outlets);
  const selectedBusiness = useAppStore((s) => s.selectedBusiness);
  const setSelectedBusiness = useAppStore((s) => s.setSelectedBusiness);

  const handleSelect = (id: string) => {
    setSelectedBusiness(id);
    queryClient.invalidateQueries({ queryKey: ['reports'] });
    queryClient.invalidateQueries({ queryKey: ['bills'] });
    queryClient.invalidateQueries({ queryKey: ['payment-modes'] });
    queryClient.invalidateQueries({ queryKey: ['dues-users'] });
    navigation.goBack();
  };

  return (
    <ScreenWrapper>
      <TopBar title="Select Outlet" showBack onBack={() => navigation.goBack()} />
      <FlatList
        data={outlets || []}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const isSelected = item._id === selectedBusiness;
          return (
            <TouchableOpacity onPress={() => handleSelect(item._id)}>
              <AppCard
                style={{
                  marginBottom: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderColor: isSelected ? '#FDE047' : 'rgba(0,0,0,0.06)',
                  borderWidth: isSelected ? 2 : 1,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827' }}>{item.name}</Text>
                  <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                    {item.registerName || item.name}
                  </Text>
                </View>
                {isSelected && <Icon name="check-circle" size={22} color="#111827" />}
              </AppCard>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
      />
    </ScreenWrapper>
  );
}
