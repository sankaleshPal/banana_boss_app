import { apiClient } from '@/api/client';
import type { StaffLoginItem, StaffLoginPayload } from './auth.types';

export const authApi = {
  staffLogin(payload: StaffLoginPayload): Promise<StaffLoginItem[]> {
    return apiClient.post('/r/auth/login/staff', payload);
  },
};
