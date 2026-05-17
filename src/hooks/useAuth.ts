import { useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/services/auth/auth.api';
import { queryClient } from '@/queries/queryClient';
import { useAppStore } from '@/stores/appStore';

export function useAuth() {
  const staff = useAuthStore((s) => s.staff);
  const outlets = useAuthStore((s) => s.outlets);
  const rememberedPhone = useAuthStore((s) => s.rememberedPhone);
  const setStaff = useAuthStore((s) => s.setStaff);
  const setOutlets = useAuthStore((s) => s.setOutlets);
  const setRememberedPhone = useAuthStore((s) => s.setRememberedPhone);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setSelectedBusiness = useAppStore((s) => s.setSelectedBusiness);

  // Derive directly from staff so zustand re-renders when staff changes to null.
  const isAuthenticated = Array.isArray(staff) && staff.length > 0;

  const login = useCallback(
    async (phone: string, password: string, remember = false) => {
      const staffRes = await authApi.staffLogin({ phone, password });

      // Build the outlets list from the login response — each StaffLoginItem
      // carries outletId, outletName, outletImageUrl — no extra API call needed.
      const seen = new Set<string>();
      const derivedOutlets = staffRes
        .filter((s) => {
          if (seen.has(s.outletId)) return false;
          seen.add(s.outletId);
          return true;
        })
        .map((s) => ({
          _id: s.outletId,
          name: s.outletName,
          outletImageUrl: s.outletImageUrl,
        }));

      setStaff(staffRes);
      setOutlets(derivedOutlets);
      // Auto-select the first outlet so outletId is never null post-login.
      if (derivedOutlets.length > 0) {
        setSelectedBusiness(derivedOutlets[0]._id);
      }
      if (remember) setRememberedPhone(phone);

      return staffRes;
    },
    [setStaff, setOutlets, setSelectedBusiness, setRememberedPhone],
  );

  const logout = useCallback(() => {
    clearAuth();
    setSelectedBusiness(null);
    queryClient.clear();
  }, [clearAuth, setSelectedBusiness]);

  return {
    staff,
    outlets,
    rememberedPhone,
    isAuthenticated,
    login,
    logout,
  };
}
