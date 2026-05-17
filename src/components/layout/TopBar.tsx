import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

interface TopBarProps {
  title: string;
  subtitle?: string;
  rightActions?: React.ReactNode;
  /** Override back visibility. Defaults to auto-detect via navigation.canGoBack() */
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

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (canGoBack) {
      navigation.goBack();
    }
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
            borderRadius: 10,
            backgroundColor: 'rgba(0,0,0,0.06)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="arrow-left" size={18} color="#111827" />
        </TouchableOpacity>
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', letterSpacing: -0.3 }}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>{subtitle}</Text>
        ) : null}
      </View>
      {rightActions}
    </View>
  );
});
