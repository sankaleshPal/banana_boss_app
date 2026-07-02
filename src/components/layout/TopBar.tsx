import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, Modal, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';
import { useOutlet } from '@/hooks/useOutlet';
import { useAppStore } from '@/stores/appStore';
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
  
  const { staff, logout, isAdmin } = useAuth();
  const { outletId, currentOutlet, outlets, selectOutlet } = useOutlet();
  const setAdminInOutlet = useAppStore((s) => s.setAdminInOutlet);
  const [modalVisible, setModalVisible] = useState(false);
  const [outletModalVisible, setOutletModalVisible] = useState(false);
  const me = staff?.[0];
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Outlet switcher: shown on top-level screens for admins or multi-outlet staff.
  const showOutletSwitcher =
    !shouldShowBack && (isAdmin || (outlets?.length ?? 0) > 1);

  const handleSelectOutlet = (id: string) => {
    selectOutlet(id);
    setOutletModalVisible(false);
  };

  const handleAllOutlets = () => {
    setOutletModalVisible(false);
    // Return the admin to the all-outlets universal view.
    setAdminInOutlet(false);
  };

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
        {showOutletSwitcher && (
          <TouchableOpacity
            onPress={() => setOutletModalVisible(true)}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              maxWidth: 160,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: radii.chip,
              backgroundColor: colors.surface.card,
              borderWidth: 1,
              borderColor: colors.surface.border,
            }}
          >
            <Icon name="home" size={13} color={colors.text.muted} />
            <Text
              numberOfLines={1}
              style={{ fontFamily: fonts.semibold, fontSize: 12, color: colors.text.base, flexShrink: 1 }}
            >
              {currentOutlet?.name ?? 'Select Outlet'}
            </Text>
            <Icon name="chevron-down" size={13} color={colors.text.muted} />
          </TouchableOpacity>
        )}

        {rightActions}

        {(me || isAdmin) && (
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
                {(me?.name || me?.nickName || (isAdmin ? 'Admin' : 'User'))[0].toUpperCase()}
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
                      {(me?.name || me?.nickName || (isAdmin ? 'Admin' : 'User'))[0].toUpperCase()}
                    </Text>
                  </View>
                  <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: colors.text.base, marginBottom: 4 }}>
                    {me?.name || me?.nickName || 'Outlet Admin'}
                  </Text>
                  {me?.phone ? (
                    <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.text.muted, marginBottom: 2 }}>
                      {me.phone}
                    </Text>
                  ) : null}
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

      {/* Outlet switcher modal */}
      <Modal
        visible={outletModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOutletModalVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: colors.surface.overlay, justifyContent: 'flex-end' }}
          activeOpacity={1}
          onPress={() => setOutletModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: colors.surface.card,
              borderTopLeftRadius: radii.sheet,
              borderTopRightRadius: radii.sheet,
              paddingTop: 8,
              paddingBottom: 32,
              maxHeight: '75%',
            }}
          >
            <View
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: colors.surface.border,
                alignSelf: 'center',
                marginBottom: 12,
              }}
            />
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 16,
                color: colors.text.base,
                paddingHorizontal: 20,
                marginBottom: 12,
              }}
            >
              Switch Outlet
            </Text>

            <ScrollView contentContainerStyle={{ paddingHorizontal: 12 }}>
              {(outlets ?? []).map((o) => {
                const active = o._id === outletId;
                return (
                  <TouchableOpacity
                    key={o._id}
                    onPress={() => handleSelectOutlet(o._id)}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      paddingVertical: 14,
                      paddingHorizontal: 12,
                      borderRadius: radii.tile,
                      backgroundColor: active ? colors.surface.raised : 'transparent',
                    }}
                  >
                    <View
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: radii.chip,
                        backgroundColor: colors.surface.raised,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon name="home" size={15} color={colors.text.base} />
                    </View>
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: active ? fonts.bold : fonts.semibold,
                        fontSize: 15,
                        color: colors.text.base,
                      }}
                      numberOfLines={1}
                    >
                      {o.name}
                    </Text>
                    {active && <Icon name="check" size={17} color={colors.primaryDark} />}
                  </TouchableOpacity>
                );
              })}

              {isAdmin && (
                <TouchableOpacity
                  onPress={handleAllOutlets}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingVertical: 14,
                    paddingHorizontal: 12,
                    marginTop: 6,
                    borderRadius: radii.tile,
                    borderTopWidth: 1,
                    borderTopColor: colors.surface.border,
                  }}
                >
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: radii.chip,
                      backgroundColor: colors.tint.accent.bg,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name="grid" size={15} color={colors.tint.accent.fg} />
                  </View>
                  <Text style={{ flex: 1, fontFamily: fonts.bold, fontSize: 15, color: colors.text.base }}>
                    All Outlets
                  </Text>
                  <Icon name="chevron-right" size={17} color={colors.text.faint} />
                </TouchableOpacity>
              )}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
});
