import { apiClient } from '@/api/client';
import type { BillsDashboardData, BillsListPage, BillsListFilters, BillListItem } from './bills.types';

function mapBillItem(b: any): BillListItem {
  if (!b) return b;

  const getDefinedNumber = (...vals: any[]): number => {
    for (const val of vals) {
      if (val !== undefined && val !== null) {
        const num = Number(val);
        if (!isNaN(num)) return num;
      }
    }
    return 0;
  };

  const mappedItems = Array.isArray(b.items)
    ? b.items.map((item: any) => {
        const itemPrice = getDefinedNumber(item.price, item.itemPrice);
        const qty = getDefinedNumber(item.quantity);
        return {
          ...item,
          total: getDefinedNumber(item.total, itemPrice * qty),
          price: itemPrice,
          quantity: qty,
        };
      })
    : [];

  return {
    ...b,
    total: getDefinedNumber(b.total, b.payable, b.grandTotal, b.totalAmount),
    discount: getDefinedNumber(b.discount, b.discountTotal, b.discountAmount),
    tax: getDefinedNumber(b.tax, b.totalTax, b.taxAmount),
    serviceCharge: getDefinedNumber(b.serviceCharge),
    subtotal: getDefinedNumber(b.subtotal),
    items: mappedItems,
  };
}

export const billsApi = {
  async getDashboard(
    outletId: string,
    from: number,
    to: number,
  ): Promise<BillsDashboardData> {
    const rawData: any = await apiClient.get(
      `/r/dine-in/bills/dashboard?outletId=${outletId}&from=${from}&to=${to}`,
    );

    if (!rawData) return rawData;

    // Deep/shallow clone the frozen object before mutating
    const data = { ...rawData };

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

    const res = await apiClient.get<BillsListPage>(`/r/dine-in/bills?${params.toString()}`);
    if (res && Array.isArray(res.data)) {
      return {
        ...res,
        data: res.data.map(mapBillItem),
      };
    }
    return res;
  },

  async getDetail(billId: string): Promise<BillListItem> {
    const res = await apiClient.get<any>(`/r/dine-in/bills/${billId}`);
    return mapBillItem(res);
  },
};
