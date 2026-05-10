import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

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
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
      }}
    >
      {showBack && (
        <TouchableOpacity onPress={onBack} style={{ marginRight: 12 }}>
          <Icon name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827' }}>{title}</Text>
        {subtitle && (
          <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{subtitle}</Text>
        )}
      </View>
      {rightActions}
    </View>
  );
});
