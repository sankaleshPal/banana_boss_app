import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { LoadingSkeleton } from './LoadingSkeleton';
import type { ReportPagination } from '@/types/common';
import { fonts } from '@/theme';
import { reportsApi, type ReportXlsxId } from '@/api/services/reports/reports.api';

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
  downloadReportId?: ReportXlsxId;
  outletId?: string | null;
  from?: number;
  to?: number;
}

export const ReportTable = React.memo(function ReportTable({
  columns,
  rows,
  totalRow,
  isLoading,
  isError,
  emptyMessage = 'No data for the selected date range.',
  onRetry,
  downloadReportId,
  outletId,
  from,
  to,
}: ReportTableProps) {
  const [isDownloading, setIsDownloading] = useState(false);
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

  const canDownload = !!downloadReportId && !!outletId && rows.length > 0 && !isLoading && !isDownloading;

  const handleDownload = async () => {
    if (!downloadReportId || !outletId) return;

    setIsDownloading(true);
    try {
      await reportsApi.downloadReportXlsx(downloadReportId, outletId, from, to);
    } catch (error) {
      Alert.alert(
        'Download failed',
        error instanceof Error ? error.message : 'Failed to download Excel report. Please try again.',
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const renderDownloadToolbar = () =>
    downloadReportId ? (
      <View style={styles.toolbar}>
        <TouchableOpacity
          activeOpacity={0.75}
          disabled={!canDownload}
          onPress={handleDownload}
          style={[styles.downloadButton, !canDownload && styles.downloadButtonDisabled]}
        >
          {isDownloading ? (
            <ActivityIndicator size="small" color="#111827" />
          ) : (
            <Icon name="download" size={15} color="#111827" />
          )}
          <Text style={styles.downloadButtonText}>{isDownloading ? 'Downloading' : 'Excel'}</Text>
        </TouchableOpacity>
      </View>
    ) : null;

  if (rows.length === 0) {
    return (
      <View>
        {renderDownloadToolbar()}
        <EmptyState title="No Data" subtitle={emptyMessage} icon="bar-chart-2" />
      </View>
    );
  }

  return (
    <View>
      {renderDownloadToolbar()}
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
    </View>
  );
});

const styles = {
  toolbar: {
    flexDirection: 'row' as const,
    justifyContent: 'flex-end' as const,
    marginTop: 12,
  },
  downloadButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 6,
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#FDE047',
    borderWidth: 1,
    borderColor: '#111827',
  },
  downloadButtonDisabled: {
    opacity: 0.45,
  },
  downloadButtonText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#111827',
    textTransform: 'uppercase' as const,
  },
  tableShell: {
    marginTop: 10,
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
