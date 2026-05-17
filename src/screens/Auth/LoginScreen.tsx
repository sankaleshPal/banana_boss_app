import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Keyboard, StatusBar } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/stores/appStore';
import { AppInput, AppButton, AppLoader } from '@/components/primitives';
import { KeyboardWrapper } from '@/components/layout';
import Icon from 'react-native-vector-icons/Feather';

/** Banana logo mark — yellow B on dark background */
function BananaLogo() {
  return (
    <View
      style={{
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: '#111827',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      {/* Outer yellow circle */}
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#FDE047',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: '900',
            color: '#111827',
            lineHeight: 32,
            marginTop: 2,
          }}
        >
          B
        </Text>
      </View>
    </View>
  );
}

export function LoginScreen() {
  const { login, rememberedPhone } = useAuth();
  // Login already sets selectedBusiness inside useAuth.login — no need to call it here.

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
      await login(phone.trim(), password.trim(), remember);
      // selectedBusiness is set inside login() — navigation happens via RootNavigator
    } catch (e: any) {
      setError(e?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardWrapper style={{ backgroundColor: '#F3F4F6' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>

        {/* ── Brand ──────────────────────────────────────────────── */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <BananaLogo />
          <Text style={{ fontSize: 28, fontWeight: '900', color: '#111827', letterSpacing: -0.5 }}>
            Banana Boss
          </Text>
          <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
            Reports & Billing
          </Text>
        </View>

        {/* ── Card ───────────────────────────────────────────────── */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            padding: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.07,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
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
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
          >
            <Icon
              name={remember ? 'check-square' : 'square'}
              size={18}
              color={remember ? '#111827' : '#9CA3AF'}
            />
            <Text style={{ marginLeft: 8, fontSize: 13, color: '#374151', fontWeight: '500' }}>
              Remember me
            </Text>
          </TouchableOpacity>

          {error ? (
            <View
              style={{
                backgroundColor: '#FEF2F2',
                borderRadius: 10,
                padding: 12,
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Icon name="alert-circle" size={15} color="#EF4444" />
              <Text style={{ color: '#EF4444', fontSize: 13, flex: 1 }}>{error}</Text>
            </View>
          ) : null}

          <AppButton label="Login" onPress={handleLogin} loading={loading} />
        </View>
      </View>

      <AppLoader visible={false} fullScreen />
    </KeyboardWrapper>
  );
}
