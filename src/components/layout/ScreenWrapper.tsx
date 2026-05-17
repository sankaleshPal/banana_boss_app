import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  type ViewProps,
} from 'react-native';

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  refreshControl?: boolean;
  onRefresh?: () => void;
  padding?: boolean;
  bg?: string;
}

export const ScreenWrapper = React.memo(function ScreenWrapper({
  children,
  scrollable,
  refreshControl,
  onRefresh,
  padding = true,
  bg = '#F8FAFC',
  style,
  ...props
}: ScreenWrapperProps) {
  const outerStyle = { flex: 1, backgroundColor: bg };
  const contentStyle = { flex: 1, paddingHorizontal: padding ? 16 : 0 };

  if (scrollable) {
    return (
      <View style={outerStyle}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: padding ? 16 : 0, paddingBottom: 32 }}
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
    <View style={outerStyle}>
      <View style={[contentStyle, style]} {...props}>
        {children}
      </View>
    </View>
  );
});
