import React from 'react';
import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors, fonts, radii } from '@/theme';

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchBar = React.memo(function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
}: SearchBarProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface.raised,
        borderRadius: radii.chip,
        paddingHorizontal: 12,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: colors.surface.border,
      }}
    >
      <Icon name="search" size={18} color={colors.text.faint} />
      <TextInput
        style={{ flex: 1, paddingVertical: 10, fontSize: 14, fontFamily: fonts.medium, color: colors.text.base, marginLeft: 8 }}
        placeholder={placeholder}
        placeholderTextColor={colors.text.faint}
        value={value}
        onChangeText={onChange}
      />
      {value.length > 0 && (
        <Icon name="x" size={18} color={colors.text.faint} onPress={onClear || (() => onChange(''))} />
      )}
    </View>
  );
});
