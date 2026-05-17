import { apiClient } from '@/api/client';
import type { BillsDashboardData, BillsListPage, BillsListFilters, BillListItem } from './bills.types';

export const billsApi = {
  async getDashboard(
    outletId: string,
    from: number,
    to: number,
  ): Promise<BillsDashboardData> {
    const data: any = await apiClient.get(
      `/r/dine-in/bills/dashboard?outletId=${outletId}&from=${from}&to=${to}`,
    );

    // ── Compatibility mapping ──────────────────────────────────────────────
    // Backend returns the new nested structure (paidAll.totals, paidAll.charges, etc.).
    // We synthesise a simplified `overall` + `paymentMethods` so older read
    // paths (if any) still work, and we expose `paidAll.paymentModes` as
    // the top-level `paymentMethods` map.
    if (data && data.paidAll && !data.overall) {
      data.overall = {
        totalSale: data.paidAll.totals?.netAfterDiscountAndCharges ?? 0,
        totalOrders: data.paidAll.totals?.ordersCount ?? 0,
        totalDiscount: data.discountSummary?.onPaid?.total ?? data.paidAll.discounts?.total ?? 0,
        totalTax: data.taxesSummary?.onPaid?.tax ?? data.paidAll.charges?.tax ?? 0,
        serviceCharge: data.taxesSummary?.onPaid?.serviceCharge ?? data.paidAll.charges?.serviceCharge ?? 0,
        tips: data.taxesSummary?.onPaid?.tip ?? data.paidAll.charges?.tip ?? 0,
        netIncome: data.paidAll.totals?.realisedRevenue ?? 0,
      };
    }

    // Normalise paymentMethods: the new shape stores them under paidAll.paymentModes
    if (data && data.paidAll?.paymentModes && !data.paymentMethods) {
      data.paymentMethods = data.paidAll.paymentModes as Record<string, number>;
    }

    return data as BillsDashboardData;
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
