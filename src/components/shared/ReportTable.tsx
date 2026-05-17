import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { LoadingSkeleton } from './LoadingSkeleton';
import type { ReportPagination } from '@/types/common';
import { fonts } from '@/theme';

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
  const columnWidths = useMemo(
    () =>
      columns.map((column, index) => {
        const values = rows.map((row) => String(row[index] ?? ''));
        if (totalRow) values.push(String(totalRow[index] ?? ''));
        const longest = Math.max(column.length, ...values.map((value) => value.length));
        return Math.min(Math.max(longest * 7 + 32, 124), 220);
      }),
    [columns, rows, totalRow],
  );
  const tableWidth = columnWidths.reduce((sum, width) => sum + width, 0);

  if (isLoading) return <LoadingSkeleton type="report-table" count={5} />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  if (rows.length === 0) {
    return <EmptyState title="No Data" subtitle={emptyMessage} icon="bar-chart-2" />;
  }

  return (
    <View style={styles.tableShell}>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator
        contentContainerStyle={{ minWidth: tableWidth }}
      >
        <View style={{ width: tableWidth }}>
          <View style={styles.headerRow}>
            {columns.map((col, index) => (
              <Text
                key={`${col}-${index}`}
                numberOfLines={2}
                style={[styles.headerCell, { width: columnWidths[index] }]}
              >
                {col}
              </Text>
            ))}
          </View>

          {rows.map((item, rowIndex) => (
            <View
              key={`row-${rowIndex}`}
              style={[
                styles.bodyRow,
                { backgroundColor: rowIndex % 2 === 0 ? '#FFFFFF' : '#F8FAFC' },
              ]}
            >
              {columns.map((_, cellIndex) => (
                <Text
                  key={`${rowIndex}-${cellIndex}`}
                  numberOfLines={2}
                  style={[styles.bodyCell, { width: columnWidths[cellIndex] }]}
                >
                  {String(item[cellIndex] ?? '')}
                </Text>
              ))}
            </View>
          ))}

          {totalRow && (
            <View style={styles.totalRow}>
              {columns.map((_, index) => (
                <Text
                  key={`total-${index}`}
                  numberOfLines={2}
                  style={[styles.totalCell, { width: columnWidths[index] }]}
                >
                  {String(totalRow[index] ?? '')}
                </Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
});

const styles = {
  tableShell: {
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden' as const,
  },
  headerRow: {
    flexDirection: 'row' as const,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerCell: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontFamily: fonts.bold,
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#475569',
    textTransform: 'uppercase' as const,
  },
  bodyRow: {
    flexDirection: 'row' as const,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
  },
  bodyCell: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
    color: '#334155',
  },
  totalRow: {
    flexDirection: 'row' as const,
    backgroundColor: '#FEF9C3',
    borderTopWidth: 1,
    borderTopColor: '#FDE68A',
  },
  totalCell: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontFamily: fonts.bold,
    fontSize: 13,
    fontWeight: '700' as const,
    color: '#111827',
  },
};
