import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SectionHeaderProps {
  title: string;
  action?: { label: string; onPress: () => void };
}

export const SectionHeader = React.memo(function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 12 }}>
      <Text style={{ fontSize: 11, fontWeight: '800', color: '#9CA3AF', letterSpacing: 1, textTransform: 'uppercase' }}>
        {title}
      </Text>
      {action && (
        <TouchableOpacity onPress={action.onPress}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#111827' }}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});
