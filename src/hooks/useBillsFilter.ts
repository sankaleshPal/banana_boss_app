import { useMemo } from 'react';
import { useAppStore, EMPTY_BILLING_FILTERS } from '@/stores/appStore';
import type { BillingFilters } from '@/stores/appStore';

export function useBillsFilter() {
  const filters = useAppStore((s) => s.billingFilters);
  const setBillingFilters = useAppStore((s) => s.setBillingFilters);
  const resetBillingFilters = useAppStore((s) => s.resetBillingFilters);

  const isDirty = useMemo(() => {
    return (
      filters.billNo !== EMPTY_BILLING_FILTERS.billNo ||
      filters.tableNo !== EMPTY_BILLING_FILTERS.tableNo ||
      filters.customerName !== EMPTY_BILLING_FILTERS.customerName ||
      filters.mobile !== EMPTY_BILLING_FILTERS.mobile ||
      filters.totalMin !== EMPTY_BILLING_FILTERS.totalMin ||
      filters.totalMax !== EMPTY_BILLING_FILTERS.totalMax ||
      filters.status !== EMPTY_BILLING_FILTERS.status ||
      filters.paymentMethod !== EMPTY_BILLING_FILTERS.paymentMethod ||
      filters.areaId !== EMPTY_BILLING_FILTERS.areaId
    );
  }, [filters]);

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.billNo) count++;
    if (filters.tableNo) count++;
    if (filters.customerName) count++;
    if (filters.mobile) count++;
    if (filters.totalMin) count++;
    if (filters.totalMax) count++;
    if (filters.status !== 'ALL') count++;
    if (filters.paymentMethod !== 'ALL') count++;
    if (filters.areaId !== 'ALL') count++;
    return count;
  }, [filters]);

  const setFilter = (key: keyof BillingFilters, value: string) => {
    setBillingFilters({ ...filters, [key]: value });
  };

  return {
    filters,
    setFilter,
    resetFilters: resetBillingFilters,
    isDirty,
    activeCount,
  };
}
