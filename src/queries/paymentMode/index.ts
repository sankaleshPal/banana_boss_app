import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentModeApi } from '@/api/services/paymentMode/paymentMode.api';
import { queryKeys } from '@/queries/queryKeys';

export function usePaymentModesQuery(outletId: string | null) {
  return useQuery({
    queryKey: queryKeys.paymentModes.list(outletId),
    queryFn: () => paymentModeApi.list(outletId!),
    enabled: !!outletId,
  });
}

export function useCreatePaymentModeMutation(outletId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: paymentModeApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.paymentModes.list(outletId) });
    },
  });
}

export function useUpdatePaymentModeMutation(outletId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { status: boolean } }) =>
      paymentModeApi.updateStatus(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.paymentModes.list(outletId) });
    },
  });
}
