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
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
  };

  if (variant === 'elevated') {
    baseStyle.shadowColor = '#000';
    baseStyle.shadowOffset = { width: 0, height: 2 };
    baseStyle.shadowOpacity = 0.06;
    baseStyle.shadowRadius = 8;
    baseStyle.elevation = 3;
  } else if (variant === 'outlined') {
    baseStyle.borderWidth = 1;
    baseStyle.borderColor = 'rgba(0,0,0,0.08)';
  } else if (variant === 'filled') {
    baseStyle.backgroundColor = '#F9FAFB';
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
