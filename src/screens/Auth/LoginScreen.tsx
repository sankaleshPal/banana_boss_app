import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Keyboard } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/stores/appStore';
import { AppInput, AppButton, AppLoader } from '@/components/primitives';
import { KeyboardWrapper } from '@/components/layout';
import Icon from 'react-native-vector-icons/Feather';

export function LoginScreen() {
  const { login, rememberedPhone } = useAuth();
  const setSelectedBusiness = useAppStore((s) => s.setSelectedBusiness);

  const [phone, setPhone] = useState(rememberedPhone || '');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    Keyboard.dismiss();
    setError('');
    if (!phone.trim() || !password.trim()) {
      setError('Please enter phone and password');
      return;
    }
    setLoading(true);
    try {
      const staff = await login(phone.trim(), password.trim(), remember);
      if (staff && staff.length > 0) {
        setSelectedBusiness(staff[0].outletId);
      }
    } catch (e: any) {
      setError(e?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardWrapper style={{ backgroundColor: '#FFFFFF' }}>
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              backgroundColor: '#FDE047',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Icon name="box" size={36} color="#111827" />
          </View>
          <Text style={{ fontSize: 26, fontWeight: '900', color: '#111827' }}>Banana Boss</Text>
          <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>Reports & Billing</Text>
        </View>

        <AppInput
          label="Phone Number"
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          leftIcon="phone"
        />
        <AppInput
          label="Password"
          placeholder="Enter password"
          secureTextEntry={secure}
          value={password}
          onChangeText={setPassword}
          leftIcon="lock"
          rightIcon={secure ? 'eye-off' : 'eye'}
          onRightIconPress={() => setSecure(!secure)}
        />

        <TouchableOpacity
          onPress={() => setRemember(!remember)}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
        >
          <Icon name={remember ? 'check-square' : 'square'} size={18} color={remember ? '#111827' : '#9CA3AF'} />
          <Text style={{ marginLeft: 8, fontSize: 13, color: '#374151' }}>Remember me</Text>
        </TouchableOpacity>

        {error ? (
          <Text style={{ color: '#EF4444', fontSize: 13, marginBottom: 12 }}>{error}</Text>
        ) : null}

        <AppButton label="Login" onPress={handleLogin} loading={loading} />
      </View>

      <AppLoader visible={loading && false} fullScreen />
    </KeyboardWrapper>
  );
}
