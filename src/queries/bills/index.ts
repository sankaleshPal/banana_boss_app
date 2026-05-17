import { useQuery } from '@tanstack/react-query';
import { billsApi } from '@/api/services/bills/bills.api';
import { queryKeys } from '@/queries/queryKeys';
import type { BillsListFilters } from '@/api/services/bills/bills.types';

export function useBillsDashboardQuery(
  outletId: string | null,
  from: number,
  to: number,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.bills.dashboard(outletId, from, to),
    queryFn: () => billsApi.getDashboard(outletId!, from, to),
    enabled: !!outletId && !!from && !!to && enabled,
  });
}

export function useBillsListQuery(
  outletId: string | null,
  from: number,
  to: number,
  page: number,
  limit: number,
  filters?: BillsListFilters,
  enabled?: boolean,
) {
  return useQuery({
    queryKey: queryKeys.bills.list(outletId, from, to, page, limit, filters ?? {}),
    queryFn: () => billsApi.getList(outletId!, from, to, page, limit, filters),
    enabled: !!outletId && !!from && !!to && (enabled !== false),
  });
}

export function useBillByIdQuery(billId: string | null) {
  return useQuery({
    queryKey: queryKeys.bills.byId(billId),
    queryFn: () => billsApi.getDetail(billId!),
    enabled: !!billId,
  });
}
