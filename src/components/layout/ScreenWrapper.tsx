import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  type ViewProps,
  SafeAreaView,
} from 'react-native';

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  refreshControl?: boolean;
  onRefresh?: () => void;
  padding?: boolean;
}

export const ScreenWrapper = React.memo(function ScreenWrapper({
  children,
  scrollable,
  refreshControl,
  onRefresh,
  padding = true,
  style,
  ...props
}: ScreenWrapperProps) {
  const contentStyle = { flex: 1, paddingHorizontal: padding ? 16 : 0 };

  if (scrollable) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <ScrollView
          style={contentStyle}
          refreshControl={
            refreshControl && onRefresh ? (
              <RefreshControl refreshing={false} onRefresh={onRefresh} />
            ) : undefined
          }
          {...props}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={[contentStyle, style]} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
});
