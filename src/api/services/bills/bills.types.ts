export interface BillItem {
  _id: string;
  itemName: string;
  itemType?: string;
  quantity: number;
  price: number;
  total: number;
  variants?: { name: string; price: number }[];
  addons?: { name: string; price: number; quantity: number }[];
}

export interface BillListItem {
  _id: string;
  invoiceNumber: string;
  userName?: string;
  tableName?: string;
  areaName?: string;
  status: string;
  paymentMethod?: string;
  subtotal: number;
  discount: number;
  tax: number;
  serviceCharge: number;
  total: number;
  createdAt: number;
  items: BillItem[];
  splitParentId?: string | null;
  splitIndex?: number;
  splitCount?: number;
}

export interface BillsDashboardData {
  overall?: {
    totalSale: number;
    totalOrders: number;
    totalDiscount: number;
    totalTax: number;
    serviceCharge: number;
    tips: number;
  };
  paidAll?: {
    totalSale: number;
    totalOrders: number;
    totalDiscount: number;
    totalTax: number;
    serviceCharge: number;
    tips: number;
  };
  paymentMethods?: Record<string, number>;
  dues?: { totalDues: number; count: number };
  runningTables?: { tableName: string; amount: number }[];
}

export interface BillsListAggregation {
  billCount: number;
  subtotal: number;
  tax: number;
  payable: number;
}

export interface BillsListPage {
  data: BillListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  aggregation?: BillsListAggregation;
}

export interface BillsListFilters {
  billNo?: string;
  tableNo?: string;
  customerName?: string;
  mobile?: string;
  totalMin?: string;
  totalMax?: string;
  status?: string;
  paymentMethod?: string;
  areaId?: string;
}
