import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, type TextInputProps } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { fonts } from '@/theme';

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
  onFocus,
  onBlur,
  ...props
}: AppInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={{ fontFamily: fonts.medium, fontSize: 13, fontWeight: '600', color: '#44403C', marginBottom: 6, letterSpacing: 0.1 }}>
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1.5,
          borderColor: error
            ? '#E05252'
            : isFocused
            ? '#1A1A1A'
            : '#EAE8E2',
          borderRadius: 14,
          paddingHorizontal: 16,
          backgroundColor: '#FFFFFF',
          shadowColor: '#1A1A1A',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isFocused ? 0.02 : 0,
          shadowRadius: 4,
          elevation: isFocused ? 1 : 0,
        }}
      >
        {leftIcon && <Icon name={leftIcon} size={18} color="#A8A29E" style={{ marginRight: 10 }} />}
        <TextInput
          style={[
            {
              flex: 1,
              paddingVertical: 14,
              fontFamily: fonts.regular,
              fontSize: 14,
              color: '#1A1A1A',
              fontWeight: '500',
            },
            style,
          ]}
          placeholderTextColor="#A8A29E"
          onFocus={(e) => {
            setIsFocused(true);
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} activeOpacity={0.7}>
            <Icon name={rightIcon} size={18} color="#A8A29E" style={{ marginLeft: 10 }} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={{ color: '#E05252', fontSize: 12, marginTop: 4, fontWeight: '500' }}>{error}</Text>}
    </View>
  );
});
