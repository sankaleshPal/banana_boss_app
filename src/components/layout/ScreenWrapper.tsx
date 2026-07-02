import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  type ViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { TopBar } from './TopBar';

interface ScreenWrapperProps extends ViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  refreshControl?: boolean;
  onRefresh?: () => void;
  padding?: boolean;
  hasTabBar?: boolean;
  bg?: string;
  /** Fixed header (e.g. <TopBar/>) pinned above the scroll area. */
  header?: React.ReactNode;
}

export const ScreenWrapper = React.memo(function ScreenWrapper({
  children,
  scrollable,
  refreshControl,
  onRefresh,
  padding = true,
  hasTabBar = true,
  bg = colors.surface.canvas, // premium light cream background
  header,
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

  // Pin the header: use the explicit `header` prop, or auto-detect a <TopBar/>
  // rendered as a child so every screen gets a fixed header without changes.
  let pinned: React.ReactNode = header ?? null;
  let scrollChildren: React.ReactNode = children;
  if (!header) {
    const arr = React.Children.toArray(children);
    const idx = arr.findIndex(
      (child) => React.isValidElement(child) && child.type === TopBar,
    );
    if (idx >= 0) {
      pinned = arr[idx];
      scrollChildren = arr.filter((_, i) => i !== idx);
    }
  }

  // Fixed header sits outside the scroll view so it stays pinned at the top.
  const fixedHeader = pinned ? (
    <View style={{ paddingHorizontal: padding ? 16 : 0, backgroundColor: bg }}>
      {pinned}
    </View>
  ) : null;

  if (scrollable) {
    return (
      <View style={containerStyle}>
        {fixedHeader}
        <ScrollView
          style={contentStyle}
          contentContainerStyle={{ paddingBottom: bottomOffset }}
          refreshControl={
            refreshControl && onRefresh ? (
              <RefreshControl refreshing={false} onRefresh={onRefresh} tintColor={colors.primaryDark} />
            ) : undefined
          }
          showsVerticalScrollIndicator={false}
          {...props}
        >
          {scrollChildren}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      {fixedHeader}
      <View style={[contentStyle, { paddingBottom: bottomOffset }, style]} {...props}>
        {scrollChildren}
      </View>
    </View>
  );
});
