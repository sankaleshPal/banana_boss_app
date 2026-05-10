import React from 'react';
import { KeyboardAvoidingView, Platform, type ViewProps } from 'react-native';

export const KeyboardWrapper = React.memo(function KeyboardWrapper({
  children,
  style,
  ...props
}: ViewProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[{ flex: 1 }, style]}
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  );
});
