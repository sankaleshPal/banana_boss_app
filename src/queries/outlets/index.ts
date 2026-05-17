import { useQuery } from '@tanstack/react-query';
import { outletApi } from '@/api/services/outlets/outlet.api';
import { queryKeys } from '@/queries/queryKeys';

export function useOutletsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.outlets.list(),
    queryFn: () => outletApi.list(),
    enabled,
  });
}

/** Fetch a single outlet's details (including billingStartTime / billingEndTime). */
export function useOutletDetails(outletId: string | null) {
  return useQuery({
    queryKey: ['outlet-details', outletId],
    queryFn: () => outletApi.get(outletId!),
    enabled: !!outletId,
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

