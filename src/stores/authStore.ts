import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StaffLoginItem } from '@/api/services/auth/auth.types';
import type { OutletListItem } from '@/api/services/outlets/outlet.types';

interface AuthState {
  staff: StaffLoginItem[] | null;
  outlets: OutletListItem[] | null;
  /** Set when the main admin logs in with email (no staff record). */
  outletAdminId: string | null;
  rememberedPhone: string | null;
  rememberedPassword: string | null;

  setStaff: (staff: StaffLoginItem[] | null) => void;
  setOutlets: (outlets: OutletListItem[] | null) => void;
  setOutletAdminId: (id: string | null) => void;
  setRememberedPhone: (phone: string | null) => void;
  setRememberedPassword: (password: string | null) => void;
  clearAuth: () => void;

  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      staff: null,
      outlets: null,
      outletAdminId: null,
      rememberedPhone: null,
      rememberedPassword: null,

      setStaff: (staff) => set({ staff }),
      setOutlets: (outlets) => set({ outlets }),
      setOutletAdminId: (id) => set({ outletAdminId: id }),
      setRememberedPhone: (phone) => set({ rememberedPhone: phone }),
      setRememberedPassword: (password) => set({ rememberedPassword: password }),
      clearAuth: () => set({ staff: null, outlets: null, outletAdminId: null }),

      isAuthenticated: () => {
        const { staff, outletAdminId } = get();
        return (Array.isArray(staff) && staff.length > 0) || !!outletAdminId;
      },
    }),
    {
      name: 'banana-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        staff: state.staff,
        outlets: state.outlets,
        outletAdminId: state.outletAdminId,
        rememberedPhone: state.rememberedPhone,
        rememberedPassword: state.rememberedPassword,
      }),
    },
  ),
);
