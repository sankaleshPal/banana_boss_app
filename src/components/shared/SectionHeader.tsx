import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, fonts } from '@/theme';

interface SectionHeaderProps {
  title: string;
  action?: { label: string; onPress: () => void };
}

export const SectionHeader = React.memo(function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 12 }}>
      <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: colors.text.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>
        {title}
      </Text>
      {action && (
        <TouchableOpacity onPress={action.onPress}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 12, color: colors.text.base }}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
});
