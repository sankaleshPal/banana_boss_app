import { apiClient } from '@/api/client';
import type { NpcUser } from './npcUser.types';

export const npcUserApi = {
  list(outletId: string): Promise<NpcUser[]> {
    return apiClient.get(`/r/npc-users?outletId=${outletId}`);
  },
  create(payload: { outletId: string; name: string; phone?: string; status?: boolean }): Promise<NpcUser> {
    return apiClient.post('/r/npc-users', payload);
  },
};
