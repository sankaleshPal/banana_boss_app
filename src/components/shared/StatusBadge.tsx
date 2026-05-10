import React from 'react';
import { AppBadge } from '@/components/primitives';

interface StatusBadgeProps {
  status?: string;
}

export const StatusBadge = React.memo(function StatusBadge({ status }: StatusBadgeProps) {
  const s = (status || '').toUpperCase();
  if (s === 'PAID' || s === 'SETTLED') {
    return <AppBadge label={s} variant="success" size="sm" />;
  }
  if (s === 'PENDING' || s === 'UNPAID') {
    return <AppBadge label={s} variant="warning" size="sm" />;
  }
  return <AppBadge label={s || 'UNKNOWN'} variant="neutral" size="sm" />;
});
