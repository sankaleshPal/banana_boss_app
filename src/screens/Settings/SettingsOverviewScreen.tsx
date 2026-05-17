import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/types/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useOutlet } from '@/hooks/useOutlet';
import Icon from 'react-native-vector-icons/Feather';

type Nav = NativeStackNavigationProp<SettingsStackParamList>;

export function SettingsOverviewScreen() {
  const navigation = useNavigation<Nav>();
  const { logout, staff } = useAuth();
  const { currentOutlet, outlets } = useOutlet();

  const me = staff?.[0];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <View
        style={{
          backgroundColor: '#111827',
          paddingHorizontal: 20,
          paddingTop: 56,
          paddingBottom: 24,
        }}
      >
        {/* Avatar */}
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            backgroundColor: '#FDE047',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: '900', color: '#111827' }}>
            {(me?.name || me?.nickName || 'U')[0].toUpperCase()}
          </Text>
        </View>
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF' }}>
          {me?.name || me?.nickName || 'Staff'}
        </Text>
        {me?.roleName ? (
          <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{me.roleName}</Text>
        ) : null}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Outlet Section ─────────────────────────────────────── */}
        <Text style={sectionLabel}>Outlet</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('OutletSelector')}
          style={cardRow}
          activeOpacity={0.75}
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: '#FEF9C3',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 14,
            }}
          >
            <Icon name="home" size={18} color="#111827" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={cardTitle}>Current Outlet</Text>
            <Text style={cardSubtitle}>{currentOutlet?.name || 'Tap to select'}</Text>
          </View>
          {(outlets?.length || 0) > 1 && (
            <View style={{ backgroundColor: '#F3F4F6', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginRight: 8 }}>
              <Text style={{ fontSize: 11, color: '#6B7280', fontWeight: '600' }}>{outlets!.length} outlets</Text>
            </View>
          )}
          <Icon name="chevron-right" size={16} color="#9CA3AF" />
        </TouchableOpacity>

        {/* ── Account Section ────────────────────────────────────── */}
        <Text style={[sectionLabel, { marginTop: 24 }]}>Account</Text>

        <TouchableOpacity
          onPress={handleLogout}
          style={[cardRow, { borderColor: '#FECACA' }]}
          activeOpacity={0.75}
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: '#FFE4E6',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 14,
            }}
          >
            <Icon name="log-out" size={18} color="#EF4444" />
          </View>
          <Text style={[cardTitle, { color: '#EF4444', flex: 1 }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const sectionLabel: import('react-native').TextStyle = {
  fontSize: 11,
  fontWeight: '800',
  color: '#9CA3AF',
  letterSpacing: 1,
  textTransform: 'uppercase',
  marginBottom: 10,
};

const cardRow: import('react-native').ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: 14,
  padding: 14,
  borderWidth: 1,
  borderColor: 'rgba(0,0,0,0.06)',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 1,
};

const cardTitle: import('react-native').TextStyle = {
  fontSize: 14,
  fontWeight: '700',
  color: '#111827',
};

const cardSubtitle: import('react-native').TextStyle = {
  fontSize: 12,
  color: '#9CA3AF',
  marginTop: 2,
};
