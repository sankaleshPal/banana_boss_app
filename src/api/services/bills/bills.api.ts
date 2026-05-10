import { apiClient } from '@/api/client';
import type { BillsDashboardData, BillsListPage, BillsListFilters, BillListItem } from './bills.types';

export const billsApi = {
  getDashboard(
    outletId: string,
    from: number,
    to: number,
  ): Promise<BillsDashboardData> {
    return apiClient.get(`/r/dine-in/bills/dashboard?outletId=${outletId}&from=${from}&to=${to}`);
  },

  getBills(
    outletId: string,
    from: number,
    to: number,
    page: number,
    limit: number,
    filters?: BillsListFilters,
  ): Promise<BillsListPage> {
    const params = new URLSearchParams({
      outletId,
      from: String(from),
      to: String(to),
      page: String(page),
      limit: String(limit),
    });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'ALL') params.append(key, String(value));
      });
    }
    return apiClient.get(`/r/dine-in/bills?${params.toString()}`);
  },

  getBillById(billId: string): Promise<BillListItem | null> {
    return apiClient.get(`/r/dine-in/bills/${billId}`);
  },
};
