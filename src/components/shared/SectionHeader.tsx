import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { fonts } from '@/theme';

interface SectionHeaderProps {
  title: string;
  action?: { label: string; onPress: () => void };
}

export const SectionHeader = React.memo(function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 12 }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: 11, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
        {title}
      </Text>
      {action && (
        <TouchableOpacity onPress={action.onPress}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 12, fontWeight: '700', color: '#0F172A' }}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});
