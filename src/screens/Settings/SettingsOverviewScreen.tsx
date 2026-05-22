import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useOutlet } from '@/hooks/useOutlet';
import Icon from 'react-native-vector-icons/Feather';
import { fonts } from '@/theme';

export function SettingsOverviewScreen() {
  const { logout, staff } = useAuth();
  const { currentOutlet } = useOutlet();

  const me = staff?.[0];

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to logout?')) {
        logout();
      }
      return;
    }

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
    <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <View
        style={{
          backgroundColor: '#0F172A',
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
            borderRadius: 8,
            backgroundColor: '#FDE047',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
          }}
        >
          <Text style={{ fontFamily: fonts.bold, fontSize: 22, fontWeight: '700', color: '#111827' }}>
            {(me?.name || me?.nickName || 'U')[0].toUpperCase()}
          </Text>
        </View>
        <Text style={{ fontFamily: fonts.bold, fontSize: 20, fontWeight: '700', color: '#FFFFFF' }}>
          {me?.name || me?.nickName || 'Staff'}
        </Text>
        {me?.roleName ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: '#CBD5E1', marginTop: 2 }}>{me.roleName}</Text>
        ) : null}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Outlet Section ─────────────────────────────────────── */}
        <Text style={sectionLabel}>Outlet</Text>

        <View
          style={cardRow}
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
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
            <Text style={cardSubtitle}>{currentOutlet?.name || 'Assigned from login'}</Text>
          </View>
        </View>

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
  fontFamily: fonts.bold,
  fontWeight: '700',
  color: '#64748B',
  textTransform: 'uppercase',
  marginBottom: 10,
};

const cardRow: import('react-native').ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: 8,
  padding: 14,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 3,
  elevation: 1,
};

const cardTitle: import('react-native').TextStyle = {
  fontSize: 14,
  fontFamily: fonts.bold,
  fontWeight: '700',
  color: '#0F172A',
};

const cardSubtitle: import('react-native').TextStyle = {
  fontSize: 12,
  fontFamily: fonts.regular,
  color: '#64748B',
  marginTop: 2,
};
