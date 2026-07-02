import { useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/services/auth/auth.api';
import { outletApi } from '@/api/services/outlets/outlet.api';
import { queryClient } from '@/queries/queryClient';
import { useAppStore } from '@/stores/appStore';
import type { OutletListItem } from '@/api/services/outlets/outlet.types';

export function useAuth() {
  const staff = useAuthStore((s) => s.staff);
  const outlets = useAuthStore((s) => s.outlets);
  const outletAdminId = useAuthStore((s) => s.outletAdminId);
  const rememberedPhone = useAuthStore((s) => s.rememberedPhone);
  const rememberedPassword = useAuthStore((s) => s.rememberedPassword);
  const setStaff = useAuthStore((s) => s.setStaff);
  const setOutlets = useAuthStore((s) => s.setOutlets);
  const setOutletAdminId = useAuthStore((s) => s.setOutletAdminId);
  const setRememberedPhone = useAuthStore((s) => s.setRememberedPhone);
  const setRememberedPassword = useAuthStore((s) => s.setRememberedPassword);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setSelectedBusiness = useAppStore((s) => s.setSelectedBusiness);
  const setAdminInOutlet = useAppStore((s) => s.setAdminInOutlet);

  // Authenticated as a staff member (mobile login) OR the main admin (email login).
  const isAdmin = !!outletAdminId;
  const isAuthenticated = (Array.isArray(staff) && staff.length > 0) || isAdmin;

  const login = useCallback(
    async (phone: string, password: string, remember = false) => {
      const staffRes = await authApi.staffLogin({ phone, password });

      // Build the outlets list from the login response — each StaffLoginItem
      // carries outletId, outletName, outletImageUrl — no extra API call needed.
      const seen = new Set<string>();
      const fallbackOutlets = staffRes
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

      const outletIds = fallbackOutlets.map((outlet) => outlet._id);
      const outletRecords = await Promise.all(
        outletIds.map(async (id, index): Promise<OutletListItem> => {
          try {
            return await outletApi.get(id);
          } catch {
            return fallbackOutlets[index];
          }
        }),
      );

      setStaff(staffRes);
      setOutlets(outletRecords);
      if (outletRecords.length > 0) {
        setSelectedBusiness(outletRecords[0]._id);
      } else {
        setSelectedBusiness(null);
      }
      if (remember) {
        setRememberedPhone(phone);
        setRememberedPassword(password);
      } else {
        setRememberedPhone(null);
        setRememberedPassword(null);
      }

      return staffRes;
    },
    [setStaff, setOutlets, setSelectedBusiness, setRememberedPhone, setRememberedPassword],
  );

  // Main admin (email) login → all outlets at once, no staff record.
  const loginAdmin = useCallback(
    async (email: string, password: string) => {
      const { outlets: adminOutlets, outletAdminId: adminId } =
        await authApi.outletAdminLogin({ email, password });

      setStaff(null);
      setOutlets(adminOutlets ?? []);
      setOutletAdminId(adminId);
      // Land on the all-outlets universal view first (no outlet entered yet).
      setSelectedBusiness(null);
      setAdminInOutlet(false);

      return adminOutlets;
    },
    [setStaff, setOutlets, setOutletAdminId, setSelectedBusiness, setAdminInOutlet],
  );

  const logout = useCallback(() => {
    clearAuth();
    setSelectedBusiness(null);
    setAdminInOutlet(false);
    queryClient.clear();
  }, [clearAuth, setSelectedBusiness, setAdminInOutlet]);

  return {
    staff,
    outlets,
    outletAdminId,
    isAdmin,
    rememberedPhone,
    rememberedPassword,
    isAuthenticated,
    login,
    loginAdmin,
    logout,
  };
}
