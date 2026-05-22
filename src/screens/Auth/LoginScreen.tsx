import React, { useState } from 'react';
import { Image, View, Text, TouchableOpacity, Keyboard, StatusBar, Platform } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { AppInput, AppButton, AppLoader } from '@/components/primitives';
import { KeyboardWrapper } from '@/components/layout';
import Icon from 'react-native-vector-icons/Feather';
import { fonts } from '@/theme';

/** Banana Boss logo mark */
function BananaLogo() {
  return (
    <View
      style={{
        width: 96,
        height: 96,
        borderRadius: 18,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <Image
        source={require('../../../assets/icon.png')}
        style={{ width: '100%', height: '100%', borderRadius: 18 }}
        resizeMode="contain"
        accessibilityLabel="Banana Boss logo"
      />
    </View>
  );
}

export function LoginScreen() {
  const { login, rememberedPhone, rememberedPassword } = useAuth();
  // Login already sets selectedBusiness inside useAuth.login — no need to call it here.

  const [phone, setPhone] = useState(rememberedPhone || '');
  const [password, setPassword] = useState(rememberedPassword || '');
  const [secure, setSecure] = useState(true);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  React.useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };
      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

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
    <KeyboardWrapper style={{ backgroundColor: '#F8FAFC' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>

        {/* ── Brand ──────────────────────────────────────────────── */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <BananaLogo />
          <Text style={{ fontFamily: fonts.bold, fontSize: 28, fontWeight: '700', color: '#0F172A' }}>
            Banana Boss
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: '#64748B', marginTop: 4 }}>
            Reports & Billing
          </Text>
        </View>

        {/* ── Card ───────────────────────────────────────────────── */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 8,
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
              <Text style={{ marginLeft: 8, fontFamily: fonts.medium, fontSize: 13, color: '#334155', fontWeight: '500' }}>
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

          {/* PWA Install Prompt */}
          {deferredPrompt && (
            <View style={{ marginTop: 24, paddingTop: 20, borderTopWidth: 1, borderColor: '#F1F5F9', alignItems: 'center' }}>
              <View style={{ backgroundColor: '#FEF9C3', padding: 10, borderRadius: 12, marginBottom: 10 }}>
                <Icon name="download" size={20} color="#B45309" />
              </View>
              <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: '#1A1A1A', marginBottom: 4 }}>
                Get the Full App Experience
              </Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: '#64748B', textAlign: 'center', marginBottom: 14 }}>
                Install Banana Boss on your home screen for fast, offline-ready access.
              </Text>
              <TouchableOpacity
                onPress={handleInstallPWA}
                style={{
                  backgroundColor: '#FDE047',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontFamily: fonts.bold, color: '#111827', fontSize: 13 }}>Download App</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <AppLoader visible={false} fullScreen />
    </KeyboardWrapper>
  );
}
