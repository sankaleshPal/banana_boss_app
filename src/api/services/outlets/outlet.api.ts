import { apiClient } from '@/api/client';
import type { OutletListItem } from './outlet.types';

export const outletApi = {
  list(): Promise<OutletListItem[]> {
    return apiClient.get('/r/outlets');
  },
  get(id: string): Promise<OutletListItem> {
    return apiClient.get(`/r/outlets/outlet/${id}`);
  },
};
