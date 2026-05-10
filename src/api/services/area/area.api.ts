import { apiClient } from '@/api/client';
import type { Area } from './area.types';

export const areaApi = {
  listDineIn(outletId: string): Promise<Area[]> {
    return apiClient.get(`/r/areas?outletId=${outletId}`);
  },
};
