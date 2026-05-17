import { useMemo } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';

export function useOutlet() {
  const outlets = useAuthStore((s) => s.outlets);
  const selectedBusiness = useAppStore((s) => s.selectedBusiness);
  const setSelectedBusiness = useAppStore((s) => s.setSelectedBusiness);

  const currentOutlet = useMemo(() => {
    if (!outlets || !selectedBusiness) return null;
    return outlets.find((o) => o._id === selectedBusiness) || null;
  }, [outlets, selectedBusiness]);

  // Use selectedBusiness directly — do NOT gate on currentOutlet being found.
  // outlets may not have loaded yet even though selectedBusiness is set,
  // which previously caused outletId = null and all queries to be disabled.
  const outletId = selectedBusiness ?? null;

  return {
    outletId,
    currentOutlet,
    outlets,
    selectOutlet: setSelectedBusiness,
  };
}
