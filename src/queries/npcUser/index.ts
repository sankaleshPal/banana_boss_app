import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { npcUserApi } from '@/api/services/npcUser/npcUser.api';
import { queryKeys } from '@/queries/queryKeys';

export function useNpcUsersQuery(outletId: string | null) {
  return useQuery({
    queryKey: queryKeys.npcUsers.list(outletId),
    queryFn: () => npcUserApi.list(outletId!),
    enabled: !!outletId,
  });
}

export function useCreateNpcUserMutation(outletId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: npcUserApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.npcUsers.list(outletId) });
    },
  });
}
