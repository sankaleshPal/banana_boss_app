import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';
import Icon from 'react-native-vector-icons/Feather';
import { fonts } from '@/theme';

interface TopBarProps {
  title: string;
  subtitle?: string;
  rightActions?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}

export const TopBar = React.memo(function TopBar({
  title,
  subtitle,
  rightActions,
  showBack,
  onBack,
}: TopBarProps) {
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();
  const shouldShowBack = showBack !== undefined ? showBack : canGoBack;
  
  const { staff, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const me = staff?.[0];
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

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (canGoBack) {
      navigation.goBack();
    }
  };

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
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 4,
        backgroundColor: 'transparent',
      }}
    >
      {shouldShowBack && (
        <TouchableOpacity
          onPress={handleBack}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={{
            marginRight: 10,
            width: 36,
            height: 36,
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#E5E7EB',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="arrow-left" size={18} color="#111827" />
        </TouchableOpacity>
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 18, fontWeight: '700', color: '#0F172A' }}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: '#64748B', marginTop: 2 }}>{subtitle}</Text>
        ) : null}
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {rightActions}
        
        {me && (
          <>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: '#FDE047',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: '#111827' }}>
                {(me?.name || me?.nickName || 'U')[0].toUpperCase()}
              </Text>
            </TouchableOpacity>

            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}
            >
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}
                activeOpacity={1}
                onPress={() => setModalVisible(false)}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    backgroundColor: '#FFFFFF',
                    width: 300,
                    borderRadius: 16,
                    padding: 24,
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      backgroundColor: '#FDE047',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <Text style={{ fontFamily: fonts.bold, fontSize: 28, color: '#111827' }}>
                      {(me?.name || me?.nickName || 'U')[0].toUpperCase()}
                    </Text>
                  </View>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: '#0F172A', marginBottom: 4 }}>
                    {me?.name || me?.nickName || 'Staff'}
                  </Text>
                  <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: '#64748B', marginBottom: 2 }}>
                    {me?.phone}
                  </Text>
                  {me?.roleName && (
                    <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: '#9CA3AF', marginBottom: 24 }}>
                      {me.roleName}
                    </Text>
                  )}

                  {deferredPrompt && (
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(false);
                        handleInstallPWA();
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#FEF9C3',
                        paddingVertical: 12,
                        paddingHorizontal: 24,
                        borderRadius: 12,
                        width: '100%',
                        justifyContent: 'center',
                        marginBottom: 12,
                      }}
                    >
                      <Icon name="download" size={18} color="#B45309" style={{ marginRight: 8 }} />
                      <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: '#B45309' }}>Download App</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      handleLogout();
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#FEE2E2',
                      paddingVertical: 12,
                      paddingHorizontal: 24,
                      borderRadius: 12,
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name="log-out" size={18} color="#EF4444" style={{ marginRight: 8 }} />
                    <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: '#EF4444' }}>Logout</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </TouchableOpacity>
            </Modal>
          </>
        )}
      </View>
    </View>
  );
});
