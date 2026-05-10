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

  const outletId = currentOutlet?._id ?? null;

  return {
    outletId,
    currentOutlet,
    outlets,
    selectOutlet: setSelectedBusiness,
  };
}
