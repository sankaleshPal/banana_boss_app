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
