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

export const reportsApi = {
  getNetSalesSummary(outletId: string, from: number, to: number): Promise<ReportResponse> {
    return apiClient.get(`/r/reports/sales/net-summary?${reportQuery(outletId, from, to)}`);
  },
  getBillWiseFlat(outletId: string, from: number, to: number, opts?: { page?: number; limit?: number }): Promise<ReportResponse> {
    return apiClient.get(`/r/reports/sales/bill-wise?${reportQuery(outletId, from, to, opts?.page, opts?.limit)}`);
  },
  getItemSales(outletId: string, from: number, to: number, opts?: { page?: number; limit?: number }): Promise<ReportResponse> {
    return apiClient.get(`/r/reports/item?${reportQuery(outletId, from, to, opts?.page, opts?.limit)}`);
  },
  getOpenItemSales(outletId: string, from: number, to: number, opts?: { page?: number; limit?: number }): Promise<ReportResponse> {
    return apiClient.get(`/r/reports/open-item?${reportQuery(outletId, from, to, opts?.page, opts?.limit)}`);
  },
  getCategorySales(outletId: string, from: number, to: number): Promise<ReportResponse> {
    return apiClient.get(`/r/reports/category?${reportQuery(outletId, from, to)}`);
  },
  getParentCategorySales(outletId: string, from: number, to: number): Promise<ReportResponse> {
    return apiClient.get(`/r/reports/parent-category?${reportQuery(outletId, from, to)}`);
  },
  getDiscountReport(outletId: string, from: number, to: number): Promise<ReportResponse> {
    return apiClient.get(`/r/reports/discount?${reportQuery(outletId, from, to)}`);
  },
  getServiceChargeReport(outletId: string, from: number, to: number, opts?: { page?: number; limit?: number }): Promise<ReportResponse> {
    return apiClient.get(`/r/reports/service-charge?${reportQuery(outletId, from, to, opts?.page, opts?.limit)}`);
  },
  getAddonWiseSales(outletId: string, from: number, to: number): Promise<ReportResponse> {
    return apiClient.get(`/r/reports/addon?${reportQuery(outletId, from, to)}`);
  },
  getDeletedKotSummary(outletId: string, from: number, to: number, opts?: { page?: number; limit?: number }): Promise<ReportResponse> {
    return apiClient.get(`/r/reports/deleted-kot?${reportQuery(outletId, from, to, opts?.page, opts?.limit)}`);
  },
  getTransferKotSummary(outletId: string, from: number, to: number, opts?: { page?: number; limit?: number }): Promise<ReportResponse> {
    return apiClient.get(`/r/reports/transfer-kot?${reportQuery(outletId, from, to, opts?.page, opts?.limit)}`);
  },
  getTransferTableSummary(outletId: string, from: number, to: number, opts?: { page?: number; limit?: number }): Promise<ReportResponse> {
    return apiClient.get(`/r/reports/transfer-table?${reportQuery(outletId, from, to, opts?.page, opts?.limit)}`);
  },
  getTableWiseSales(outletId: string, from: number, to: number): Promise<ReportResponse> {
    return apiClient.get(`/r/reports/table?${reportQuery(outletId, from, to)}`);
  },
  getExtraChargeReport(outletId: string, from: number, to: number): Promise<ReportResponse> {
    return apiClient.get(`/r/reports/charge?${reportQuery(outletId, from, to)}`);
  },
  getItemTypeSales(outletId: string, from: number, to: number): Promise<ReportResponse> {
    return apiClient.get(`/r/reports/item-type?${reportQuery(outletId, from, to)}`);
  },
  getItemVariantSales(outletId: string, from: number, to: number): Promise<ReportResponse> {
    return apiClient.get(`/r/reports/item-variant?${reportQuery(outletId, from, to)}`);
  },
  getAreaReport(outletId: string, from: number, to: number): Promise<ReportResponse> {
    return apiClient.get(`/r/reports/area/summary?${reportQuery(outletId, from, to)}`);
  },
  getAreaItemSaleReport(outletId: string, from: number, to: number): Promise<ReportResponse> {
    return apiClient.get(`/r/reports/area/item-sales?${reportQuery(outletId, from, to)}`);
  },
  getOutstandingDues(outletId: string): Promise<ReportResponse> {
    return apiClient.get(`/r/reports/dues/outstanding?outletId=${outletId}`);
  },
};
