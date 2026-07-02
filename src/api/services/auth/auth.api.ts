import { apiClient } from '@/api/client';
import type {
  OutletAdminLoginPayload,
  OutletAdminLoginResponse,
  StaffLoginItem,
  StaffLoginPayload,
} from './auth.types';

export const authApi = {
  staffLogin(payload: StaffLoginPayload): Promise<StaffLoginItem[]> {
    return apiClient.post('/r/auth/login/staff', payload);
  },

  /** Main outlet-admin login (email + password) → all outlets + admin id. */
  outletAdminLogin(
    payload: OutletAdminLoginPayload,
  ): Promise<OutletAdminLoginResponse> {
    return apiClient.post('/r/auth/login/outlet-admin', payload);
  },
};
