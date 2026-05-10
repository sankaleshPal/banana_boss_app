import React, { useMemo } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { EmptyState, ErrorState, LoadingSkeleton } from './';
import type { ReportPagination } from '@/types/common';

interface ReportTableProps {
  columns: string[];
  rows: (string | number)[][];
  totalRow?: (string | number)[];
  isLoading: boolean;
  isError: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  searchable?: boolean;
  pagination?: ReportPagination;
  onPageChange?: (page: number) => void;
}

export const ReportTable = React.memo(function ReportTable({
  columns,
  rows,
  totalRow,
  isLoading,
  isError,
  emptyMessage = 'No data for the selected date range.',
  onRetry,
}: ReportTableProps) {
  if (isLoading) return <LoadingSkeleton type="report-table" count={5} />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  if (rows.length === 0) return <EmptyState title="No Data" subtitle={emptyMessage} icon="bar-chart-2" />;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator>
      <View>
        {/* Header */}
        <View style={{ flexDirection: 'row', backgroundColor: '#F9FAFB', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 8 }}>
          {columns.map((col, i) => (
            <Text
              key={i}
              style={{
                width: 120,
                fontSize: 11,
                fontWeight: '800',
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {col}
            </Text>
          ))}
        </View>

        {/* Rows */}
        <FlatList
          data={rows}
          keyExtractor={(_, i) => `row-${i}`}
          renderItem={({ item, index }) => (
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 10,
                paddingHorizontal: 8,
                backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
              }}
            >
              {item.map((cell, ci) => (
                <Text key={ci} style={{ width: 120, fontSize: 13, color: '#374151' }}>
                  {String(cell)}
                </Text>
              ))}
            </View>
          )}
          scrollEnabled={false}
        />

        {/* Total Row */}
        {totalRow && (
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 10,
              paddingHorizontal: 8,
              backgroundColor: '#FEF9C3',
              borderRadius: 8,
              marginTop: 4,
            }}
          >
            {totalRow.map((cell, i) => (
              <Text key={i} style={{ width: 120, fontSize: 13, fontWeight: '800', color: '#111827' }}>
                {String(cell)}
              </Text>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
});
