import React from 'react';
import { View, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

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
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        paddingHorizontal: 12,
        marginVertical: 8,
      }}
    >
      <Icon name="search" size={18} color="#9CA3AF" />
      <TextInput
        style={{ flex: 1, paddingVertical: 10, fontSize: 14, color: '#111827', marginLeft: 8 }}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChange}
      />
      {value.length > 0 && (
        <Icon name="x" size={18} color="#9CA3AF" onPress={onClear || (() => onChange(''))} />
      )}
    </View>
  );
});
