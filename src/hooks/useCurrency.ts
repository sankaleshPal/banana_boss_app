import { useCallback } from 'react';
import { formatINR } from '@/utils/currency';

export function useCurrency() {
  const format = useCallback((n: number) => formatINR(n), []);
  return { format };
}
