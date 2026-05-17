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

    // Synthesise legacy `overall` and `paymentMethods` fields so any
    // older read paths still work if the backend returns the new nested shape.
    if (data && data.paidAll && !data.overall) {
      data.overall = {
        totalSale:      data.paidAll.totals?.netAfterDiscountAndCharges ?? 0,
        totalOrders:    data.paidAll.totals?.ordersCount ?? 0,
        totalDiscount:  data.discountSummary?.onPaid?.total ?? 0,
        totalTax:       data.taxesSummary?.onPaid?.tax ?? 0,
        serviceCharge:  data.taxesSummary?.onPaid?.serviceCharge ?? 0,
        tips:           data.taxesSummary?.onPaid?.tip ?? 0,
      };
    }
    if (data?.paidAll?.paymentModes && !data.paymentMethods) {
      data.paymentMethods = data.paidAll.paymentModes;
    }

    return data as BillsDashboardData;
  },

  async getList(
    outletId: string,
    from: number,
    to: number,
    page = 1,
    limit = 20,
    filters?: BillsListFilters,
  ): Promise<BillsListPage> {
    const params = new URLSearchParams({
      outletId,
      from: String(from),
      to: String(to),
      page: String(page),
      limit: String(limit),
    });
    if (filters?.status && filters.status !== 'ALL') params.set('status', filters.status);
    if (filters?.paymentMethod && filters.paymentMethod !== 'ALL') params.set('paymentMethod', filters.paymentMethod);
    if (filters?.billNo) params.set('billNo', filters.billNo);
    if (filters?.tableNo) params.set('tableNo', filters.tableNo);
    if (filters?.customerName) params.set('customerName', filters.customerName);
    if (filters?.mobile) params.set('mobile', filters.mobile);
    if (filters?.totalMin) params.set('totalMin', filters.totalMin);
    if (filters?.totalMax) params.set('totalMax', filters.totalMax);
    if (filters?.areaId && filters.areaId !== 'ALL') params.set('areaId', filters.areaId);

    return apiClient.get(`/r/dine-in/bills?${params.toString()}`);
  },

  async getDetail(billId: string): Promise<BillListItem> {
    return apiClient.get(`/r/dine-in/bills/${billId}`);
  },
};
