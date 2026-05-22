import { apiClient } from '@/api/client';
import type { DuesUser } from './duesUser.types';

export const duesUserApi = {
  list(outletId: string): Promise<DuesUser[]> {
    return apiClient.get(`/r/dues-users?outletId=${outletId}`);
  },
  create(payload: { outletId: string; name: string; phone?: string; status?: boolean; currentDuesAmount?: number }): Promise<DuesUser> {
    return apiClient.post('/r/dues-users', payload);
  },
};
