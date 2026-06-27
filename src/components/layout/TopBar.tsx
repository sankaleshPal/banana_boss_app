import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';
import Icon from 'react-native-vector-icons/Feather';
import { colors, fonts, radii } from '@/theme';

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
            borderRadius: radii.chip,
            backgroundColor: colors.surface.card,
            borderWidth: 1,
            borderColor: colors.surface.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="arrow-left" size={18} color={colors.text.base} />
        </TouchableOpacity>
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.text.base }}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.text.muted, marginTop: 2 }}>{subtitle}</Text>
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
                borderRadius: radii.chip,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.text.onAccent }}>
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
                style={{ flex: 1, backgroundColor: colors.surface.overlay, justifyContent: 'center', alignItems: 'center' }}
                activeOpacity={1}
                onPress={() => setModalVisible(false)}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    backgroundColor: colors.surface.card,
                    width: 300,
                    borderRadius: radii.sheet,
                    padding: 24,
                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: radii.tile,
                      backgroundColor: colors.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <Text style={{ fontFamily: fonts.bold, fontSize: 28, color: colors.text.onAccent }}>
                      {(me?.name || me?.nickName || 'U')[0].toUpperCase()}
                    </Text>
                  </View>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: colors.text.base, marginBottom: 4 }}>
                    {me?.name || me?.nickName || 'Staff'}
                  </Text>
                  <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.text.muted, marginBottom: 2 }}>
                    {me?.phone}
                  </Text>
                  {me?.roleName && (
                    <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.text.faint, marginBottom: 24 }}>
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
                        backgroundColor: colors.tint.accent.bg,
                        paddingVertical: 12,
                        paddingHorizontal: 24,
                        borderRadius: radii.tile,
                        width: '100%',
                        justifyContent: 'center',
                        marginBottom: 12,
                      }}
                    >
                      <Icon name="download" size={18} color={colors.tint.accent.fg} style={{ marginRight: 8 }} />
                      <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.tint.accent.fg }}>Download App</Text>
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
                      backgroundColor: colors.tint.rose.bg,
                      paddingVertical: 12,
                      paddingHorizontal: 24,
                      borderRadius: radii.tile,
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name="log-out" size={18} color={colors.danger} style={{ marginRight: 8 }} />
                    <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.danger }}>Logout</Text>
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
