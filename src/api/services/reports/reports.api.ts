import { apiClient } from '@/api/client';
import type { ReportPagination } from '@/types/common';

function reportQuery(
  outletId: string,
  from: number,
  to: number,
  page?: number,
  limit?: number,
): string {
  const params = new URLSearchParams({
    outletId,
    from: String(from),
    to: String(to),
  });
  if (page !== undefined) params.append('page', String(page));
  if (limit !== undefined) params.append('limit', String(limit));
  return params.toString();
}

export interface ReportResponse<T = any> {
  data: T[];
  pagination?: ReportPagination;
  totals?: Record<string, number | string>;
}

// The backend wraps every response as:
//   ApiResponse.data = [{ outletId, outletname, from, to, <namedField>: [...] }]
// After apiClient strips the outer envelope we get that array.
// Each helper below extracts the correct named field into { data: [] }.
function extractField<T>(raw: any[], field: string): ReportResponse<T> {
  const first = Array.isArray(raw) ? (raw[0] ?? {}) : raw ?? {};
  const arr = first[field];
  return {
    data: Array.isArray(arr) ? arr : arr != null ? [arr] : [],
    pagination: first.pagination,
    totals: first.totals,
  };
}

export const reportsApi = {
  // Net-sales returns a nested object — consumed as a raw array by NetSalesSummaryScreen
  getNetSalesSummary(outletId: string, from: number, to: number): Promise<any[]> {
    return apiClient.get(`/r/reports/sales/net-summary?${reportQuery(outletId, from, to)}`);
  },

  // bills: [{ bill: { invoiceNumber, payable, paymentMethod, ... }, userName, tableName, waiterName }]
  async getBillWiseFlat(outletId: string, from: number, to: number, opts?: { page?: number; limit?: number }): Promise<ReportResponse> {
    const raw = await apiClient.get<any[]>(`/r/reports/sales/bill-wise?${reportQuery(outletId, from, to, opts?.page, opts?.limit)}`);
    return extractField(raw, 'bills');
  },

  // items: [{ itemName, quantity, discountAmount, gross, tax, total, ... }]
  async getItemSales(outletId: string, from: number, to: number, opts?: { page?: number; limit?: number }): Promise<ReportResponse> {
    const raw = await apiClient.get<any[]>(`/r/reports/item?${reportQuery(outletId, from, to, opts?.page, opts?.limit)}`);
    return extractField(raw, 'items');
  },

  // openItems: [{ itemName, quantity, gross, discount, tax, total }]
  async getOpenItemSales(outletId: string, from: number, to: number, opts?: { page?: number; limit?: number }): Promise<ReportResponse> {
    const raw = await apiClient.get<any[]>(`/r/reports/open-item?${reportQuery(outletId, from, to, opts?.page, opts?.limit)}`);
    return extractField(raw, 'openItems');
  },

  // categories: [{ category, count, quantity, gross, discount, tax, total, contributionPercent }]
  async getCategorySales(outletId: string, from: number, to: number): Promise<ReportResponse> {
    const raw = await apiClient.get<any[]>(`/r/reports/category?${reportQuery(outletId, from, to)}`);
    return extractField(raw, 'categories');
  },

  // parentCategories: [{ parentCategory, count, quantity, gross, discount, tax, total }]
  async getParentCategorySales(outletId: string, from: number, to: number): Promise<ReportResponse> {
    const raw = await apiClient.get<any[]>(`/r/reports/parent-category?${reportQuery(outletId, from, to)}`);
    return extractField(raw, 'parentCategories');
  },

  // discounts: [{ discountName, count, amount }]
  async getDiscountReport(outletId: string, from: number, to: number): Promise<ReportResponse> {
    const raw = await apiClient.get<any[]>(`/r/reports/discount?${reportQuery(outletId, from, to)}`);
    return extractField(raw, 'discounts');
  },

  // serviceCharge: [{ invoiceNumber, serviceCharge, containerCharge, deliveryCharge, total }]
  async getServiceChargeReport(outletId: string, from: number, to: number, opts?: { page?: number; limit?: number }): Promise<ReportResponse> {
    const raw = await apiClient.get<any[]>(`/r/reports/service-charge?${reportQuery(outletId, from, to, opts?.page, opts?.limit)}`);
    return extractField(raw, 'serviceCharge');
  },

  // addons: [{ addonName, quantity, amount, totalSales }]
  async getAddonWiseSales(outletId: string, from: number, to: number): Promise<ReportResponse> {
    const raw = await apiClient.get<any[]>(`/r/reports/addon?${reportQuery(outletId, from, to)}`);
    return extractField(raw, 'addons');
  },

  // rows: [{ kotId, itemName, quantity, amount, reason, createdAt }]
  async getDeletedKotSummary(outletId: string, from: number, to: number, opts?: { page?: number; limit?: number }): Promise<ReportResponse> {
    const raw = await apiClient.get<any[]>(`/r/reports/deleted-kot?${reportQuery(outletId, from, to, opts?.page, opts?.limit)}`);
    return extractField(raw, 'rows');
  },

  // transfers: [{ kotId, fromTable, toTable, itemNames, createdAt }]
  async getTransferKotSummary(outletId: string, from: number, to: number, opts?: { page?: number; limit?: number }): Promise<ReportResponse> {
    const raw = await apiClient.get<any[]>(`/r/reports/transfer-kot?${reportQuery(outletId, from, to, opts?.page, opts?.limit)}`);
    return extractField(raw, 'transfers');
  },

  // transfers: [{ fromTable, toTable, itemNames, createdAt }]
  async getTransferTableSummary(outletId: string, from: number, to: number, opts?: { page?: number; limit?: number }): Promise<ReportResponse> {
    const raw = await apiClient.get<any[]>(`/r/reports/transfer-table?${reportQuery(outletId, from, to, opts?.page, opts?.limit)}`);
    return extractField(raw, 'transfers');
  },

  // tables: [{ tableName, billCount, quantity, gross, tax, total }]
  async getTableWiseSales(outletId: string, from: number, to: number): Promise<ReportResponse> {
    const raw = await apiClient.get<any[]>(`/r/reports/table?${reportQuery(outletId, from, to)}`);
    return extractField(raw, 'tables');
  },

  // charges: full charge object — wrapped in array for consistency
  async getExtraChargeReport(outletId: string, from: number, to: number): Promise<ReportResponse> {
    const raw = await apiClient.get<any[]>(`/r/reports/charge?${reportQuery(outletId, from, to)}`);
    return extractField(raw, 'charges');
  },

  // itemTypes: [{ itemType, quantity, gross, tax, total }]
  async getItemTypeSales(outletId: string, from: number, to: number): Promise<ReportResponse> {
    const raw = await apiClient.get<any[]>(`/r/reports/item-type?${reportQuery(outletId, from, to)}`);
    return extractField(raw, 'itemTypes');
  },

  // itemVariants: [{ itemName, variantName, addonNames, quantity, gross, tax, total }]
  async getItemVariantSales(outletId: string, from: number, to: number): Promise<ReportResponse> {
    const raw = await apiClient.get<any[]>(`/r/reports/item-variant?${reportQuery(outletId, from, to)}`);
    return extractField(raw, 'itemVariants');
  },

  // NOTE: Area report routes do not exist on the backend yet — return empty until implemented
  getAreaReport(_outletId: string, _from: number, _to: number): Promise<ReportResponse> {
    return Promise.resolve({ data: [] });
  },

  getAreaItemSaleReport(_outletId: string, _from: number, _to: number): Promise<ReportResponse> {
    return Promise.resolve({ data: [] });
  },

  // outstandingDues: [{ customerName, phone, amount, status }]
  async getOutstandingDues(outletId: string): Promise<ReportResponse> {
    const raw = await apiClient.get<any[]>(`/r/reports/dues/outstanding?outletId=${outletId}`);
    return extractField(raw, 'outstandingDues');
  },
};
