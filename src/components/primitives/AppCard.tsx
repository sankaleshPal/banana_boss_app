import React from 'react';
import { View, type ViewProps, TouchableOpacity } from 'react-native';

interface AppCardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  onPress?: () => void;
}

export const AppCard = React.memo(function AppCard({
  variant = 'default',
  onPress,
  style,
  children,
  ...props
}: AppCardProps) {
  const baseStyle: any = {
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  };

  if (variant === 'elevated') {
    baseStyle.shadowColor = '#000';
    baseStyle.shadowOffset = { width: 0, height: 2 };
    baseStyle.shadowOpacity = 0.04;
    baseStyle.shadowRadius = 6;
    baseStyle.elevation = 1;
  } else if (variant === 'outlined') {
    baseStyle.borderWidth = 1;
    baseStyle.borderColor = '#CBD5E1';
  } else if (variant === 'filled') {
    baseStyle.backgroundColor = '#F8FAFC';
  }

  const content = (
    <View style={[baseStyle, style]} {...props}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
});
