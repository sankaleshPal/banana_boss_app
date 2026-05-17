import { useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/services/auth/auth.api';
import { outletApi } from '@/api/services/outlets/outlet.api';
import { queryClient } from '@/queries/queryClient';

export function useAuth() {
  const staff = useAuthStore((s) => s.staff);
  const outlets = useAuthStore((s) => s.outlets);
  const rememberedPhone = useAuthStore((s) => s.rememberedPhone);
  const setStaff = useAuthStore((s) => s.setStaff);
  const setOutlets = useAuthStore((s) => s.setOutlets);
  const setRememberedPhone = useAuthStore((s) => s.setRememberedPhone);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  // Derive directly from staff so zustand re-renders when staff changes to null.
  // Calling a method selector (s.isAuthenticated()) can miss updates because
  // the function reference stays stable even when the underlying data changes.
  const isAuthenticated = Array.isArray(staff) && staff.length > 0;

  const login = useCallback(
    async (phone: string, password: string, remember = false) => {
      const staffRes = await authApi.staffLogin({ phone, password });
      const outletRes = await outletApi.list();
      setStaff(staffRes);
      setOutlets(outletRes);
      if (remember) setRememberedPhone(phone);
      return staffRes;
    },
    [setStaff, setOutlets, setRememberedPhone],
  );

  const logout = useCallback(() => {
    clearAuth();
    queryClient.clear();
  }, [clearAuth]);

  return {
    staff,
    outlets,
    rememberedPhone,
    isAuthenticated,
    login,
    logout,
  };
}
