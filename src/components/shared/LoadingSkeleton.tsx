import React from 'react';
import { View } from 'react-native';

interface LoadingSkeletonProps {
  type: 'metric-card' | 'bill-row' | 'report-table' | 'report-card';
  count?: number;
}

export const LoadingSkeleton = React.memo(function LoadingSkeleton({
  type,
  count = 1,
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count });

  if (type === 'metric-card') {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {items.map((_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              minWidth: 140,
              height: 100,
              backgroundColor: '#F3F4F6',
              borderRadius: 14,
            }}
          />
        ))}
      </View>
    );
  }

  if (type === 'bill-row') {
    return (
      <View>
        {items.map((_, i) => (
          <View
            key={i}
            style={{
              height: 72,
              backgroundColor: '#F3F4F6',
              borderRadius: 10,
              marginBottom: 8,
            }}
          />
        ))}
      </View>
    );
  }

  if (type === 'report-table') {
    return (
      <View>
        <View style={{ height: 40, backgroundColor: '#F3F4F6', borderRadius: 8, marginBottom: 8 }} />
        {items.map((_, i) => (
          <View key={i} style={{ height: 36, backgroundColor: '#F3F4F6', borderRadius: 6, marginBottom: 6 }} />
        ))}
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
      {items.map((_, i) => (
        <View key={i} style={{ width: '47%', height: 90, backgroundColor: '#F3F4F6', borderRadius: 12 }} />
      ))}
    </View>
  );
});
