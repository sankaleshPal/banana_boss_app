import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { duesUserApi } from '@/api/services/duesUser/duesUser.api';
import { queryKeys } from '@/queries/queryKeys';

export function useDuesUsersQuery(outletId: string | null) {
  return useQuery({
    queryKey: queryKeys.duesUsers.list(outletId),
    queryFn: () => duesUserApi.list(outletId!),
    enabled: !!outletId,
  });
}

export function useCreateDuesUserMutation(outletId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: duesUserApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.duesUsers.list(outletId) });
    },
  });
}
