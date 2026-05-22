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
    borderRadius: 24,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE8E2',
  };

  if (variant === 'elevated') {
    baseStyle.shadowColor = '#1A1A1A';
    baseStyle.shadowOffset = { width: 0, height: 8 };
    baseStyle.shadowOpacity = 0.05;
    baseStyle.shadowRadius = 16;
    baseStyle.elevation = 4;
  } else if (variant === 'outlined') {
    baseStyle.borderWidth = 1.5;
    baseStyle.borderColor = '#D6D3D1';
  } else if (variant === 'filled') {
    baseStyle.backgroundColor = '#F5F3EF';
    baseStyle.borderWidth = 0;
  } else {
    // Default variant has a fine border and a light micro shadow
    baseStyle.shadowColor = '#1A1A1A';
    baseStyle.shadowOffset = { width: 0, height: 4 };
    baseStyle.shadowOpacity = 0.03;
    baseStyle.shadowRadius = 8;
    baseStyle.elevation = 2;
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
