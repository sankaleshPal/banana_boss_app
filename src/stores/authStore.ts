import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StaffLoginItem } from '@/api/services/auth/auth.types';
import type { OutletListItem } from '@/api/services/outlets/outlet.types';

interface AuthState {
  staff: StaffLoginItem[] | null;
  outlets: OutletListItem[] | null;
  rememberedPhone: string | null;
  rememberedPassword: string | null;

  setStaff: (staff: StaffLoginItem[] | null) => void;
  setOutlets: (outlets: OutletListItem[] | null) => void;
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
      rememberedPhone: null,
      rememberedPassword: null,

      setStaff: (staff) => set({ staff }),
      setOutlets: (outlets) => set({ outlets }),
      setRememberedPhone: (phone) => set({ rememberedPhone: phone }),
      setRememberedPassword: (password) => set({ rememberedPassword: password }),
      clearAuth: () => set({ staff: null, outlets: null }),

      isAuthenticated: () => {
        const { staff } = get();
        return Array.isArray(staff) && staff.length > 0;
      },
    }),
    {
      name: 'banana-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        staff: state.staff,
        outlets: state.outlets,
        rememberedPhone: state.rememberedPhone,
        rememberedPassword: state.rememberedPassword,
      }),
    },
  ),
);
