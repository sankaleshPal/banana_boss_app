import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { ReportPagination } from '@/types/common';
import { colors, fonts, radii } from '@/theme';

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
          backgroundColor: page <= 1 ? colors.surface.raised : colors.primaryDark,
          borderRadius: radii.chip,
          opacity: page <= 1 ? 0.6 : 1,
        }}
      >
        <Text style={{ color: page <= 1 ? colors.text.faint : colors.text.white, fontFamily: fonts.bold, fontSize: 12 }}>Previous</Text>
      </TouchableOpacity>

      <Text style={{ marginHorizontal: 16, fontSize: 13, fontFamily: fonts.bold, color: colors.text.secondary }}>
        Page {page} of {totalPages}
      </Text>

      <TouchableOpacity
        onPress={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        style={{
          paddingHorizontal: 14,
          paddingVertical: 8,
          backgroundColor: page >= totalPages ? colors.surface.raised : colors.primaryDark,
          borderRadius: radii.chip,
          opacity: page >= totalPages ? 0.6 : 1,
        }}
      >
        <Text style={{ color: page >= totalPages ? colors.text.faint : colors.text.white, fontFamily: fonts.bold, fontSize: 12 }}>Next</Text>
      </TouchableOpacity>
    </View>
  );
});
