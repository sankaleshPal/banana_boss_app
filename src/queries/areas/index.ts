import { useQuery } from '@tanstack/react-query';
import { areaApi } from '@/api/services/area/area.api';
import { queryKeys } from '@/queries/queryKeys';

export function useAreasDineInQuery(outletId: string | null) {
  return useQuery({
    queryKey: queryKeys.areas.dineIn(outletId),
    queryFn: () => areaApi.listDineIn(outletId!),
    enabled: !!outletId,
  });
}
