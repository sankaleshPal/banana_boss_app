import React from 'react';
import { View, TextInput, Text, TouchableOpacity, type TextInputProps } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

export const AppInput = React.memo(function AppInput({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  ...props
}: AppInputProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      {label && (
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: error ? '#EF4444' : 'rgba(0,0,0,0.08)',
          borderRadius: 10,
          paddingHorizontal: 12,
          backgroundColor: '#FFFFFF',
        }}
      >
        {leftIcon && <Icon name={leftIcon} size={18} color="#9CA3AF" style={{ marginRight: 8 }} />}
        <TextInput
          style={[{ flex: 1, paddingVertical: 12, fontSize: 14, color: '#111827' }, style]}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress}>
            <Icon name={rightIcon} size={18} color="#9CA3AF" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{error}</Text>}
    </View>
  );
});
