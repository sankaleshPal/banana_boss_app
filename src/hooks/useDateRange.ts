import { useCallback } from 'react';
import {
  getTodayRange,
  getYesterdayRange,
  getThisWeekRange,
  getThisMonthRange,
  formatDateShort,
} from '@/utils/date';
import type { DateRangePreset, DateRangeValue } from '@/stores/appStore';

export function useDateRange() {
  const getRangeByPreset = useCallback((preset: DateRangePreset): Omit<DateRangeValue, 'preset'> => {
    switch (preset) {
      case 'today':
        return getTodayRange();
      case 'yesterday':
        return getYesterdayRange();
      case 'this_week':
        return getThisWeekRange();
      case 'this_month':
        return getThisMonthRange();
      default:
        return getTodayRange();
    }
  }, []);

  const formatRangeLabel = useCallback((range: DateRangeValue): string => {
    if (range.preset !== 'custom') {
      return range.preset.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    }
    return `${formatDateShort(range.from)} - ${formatDateShort(range.to)}`;
  }, []);

  return {
    getTodayRange,
    getYesterdayRange,
    getThisWeekRange,
    getThisMonthRange,
    getRangeByPreset,
    formatRangeLabel,
  };
}
