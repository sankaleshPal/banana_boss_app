import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/types/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useOutlet } from '@/hooks/useOutlet';
import { ScreenWrapper } from '@/components/layout';
import Icon from 'react-native-vector-icons/Feather';

export function SettingsOverviewScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();
  const { logout } = useAuth();
  const { currentOutlet } = useOutlet();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScreenWrapper scrollable>
      <View style={{ paddingVertical: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#111827' }}>Settings</Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('OutletSelector')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.06)',
          marginBottom: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827' }}>Current Outlet</Text>
          <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{currentOutlet?.name || 'Not selected'}</Text>
        </View>
        <Icon name="chevron-right" size={18} color="#9CA3AF" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.06)',
        }}
      >
        <Icon name="log-out" size={18} color="#EF4444" />
        <Text style={{ flex: 1, marginLeft: 12, fontSize: 14, fontWeight: '700', color: '#EF4444' }}>Logout</Text>
        <Icon name="chevron-right" size={18} color="#9CA3AF" />
      </TouchableOpacity>
    </ScreenWrapper>
  );
}
