import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { ReportPagination } from '@/types/common';

interface PaginationBarProps {
  pagination: ReportPagination;
  onPageChange: (page: number) => void;
}

export const PaginationBar = React.memo(function PaginationBar({
  pagination,
  onPageChange,
}: PaginationBarProps) {
  const { page, totalPages } = pagination;
  if (totalPages <= 1) return null;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16 }}>
      <TouchableOpacity
        onPress={() => onPageChange(page - 1)}
        disabled={page <= 1}
        style={{
          paddingHorizontal: 14,
          paddingVertical: 8,
          backgroundColor: page <= 1 ? '#F3F4F6' : '#111827',
          borderRadius: 8,
          opacity: page <= 1 ? 0.5 : 1,
        }}
      >
        <Text style={{ color: page <= 1 ? '#9CA3AF' : '#FFFFFF', fontWeight: '700', fontSize: 12 }}>Previous</Text>
      </TouchableOpacity>

      <Text style={{ marginHorizontal: 16, fontSize: 13, fontWeight: '700', color: '#374151' }}>
        Page {page} of {totalPages}
      </Text>

      <TouchableOpacity
        onPress={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        style={{
          paddingHorizontal: 14,
          paddingVertical: 8,
          backgroundColor: page >= totalPages ? '#F3F4F6' : '#111827',
          borderRadius: 8,
          opacity: page >= totalPages ? 0.5 : 1,
        }}
      >
        <Text style={{ color: page >= totalPages ? '#9CA3AF' : '#FFFFFF', fontWeight: '700', fontSize: 12 }}>Next</Text>
      </TouchableOpacity>
    </View>
  );
});
