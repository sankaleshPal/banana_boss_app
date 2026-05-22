import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  type ViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  refreshControl?: boolean;
  onRefresh?: () => void;
  padding?: boolean;
  hasTabBar?: boolean;
  bg?: string;
}

export const ScreenWrapper = React.memo(function ScreenWrapper({
  children,
  scrollable,
  refreshControl,
  onRefresh,
  padding = true,
  hasTabBar = true,
  bg = '#FAF9F6', // Default to premium light cream background
  style,
  ...props
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  const containerStyle = {
    flex: 1,
    backgroundColor: bg,
    paddingTop: insets.top,
  };

  const contentStyle = {
    flex: 1,
    paddingHorizontal: padding ? 16 : 0,
  };

  const bottomOffset = hasTabBar ? (insets.bottom + 96) : (insets.bottom + 16);

  if (scrollable) {
    return (
      <View style={containerStyle}>
        <ScrollView
          style={contentStyle}
          contentContainerStyle={{ paddingBottom: bottomOffset }}
          refreshControl={
            refreshControl && onRefresh ? (
              <RefreshControl refreshing={false} onRefresh={onRefresh} tintColor="#111827" />
            ) : undefined
          }
          showsVerticalScrollIndicator={false}
          {...props}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <View style={[contentStyle, { paddingBottom: bottomOffset }, style]} {...props}>
        {children}
      </View>
    </View>
  );
});
