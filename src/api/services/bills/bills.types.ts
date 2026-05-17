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

// ─── New nested structure returned by the current backend ────────────────────

export interface DashboardTotals {
  grossSubtotal: number;
  netAfterDiscountAndCharges: number;
  realisedRevenue: number;
  ordersCount: number;
  paxCount: number;
}

export interface DashboardRoundOff {
  value: number;
  type: 'ADD' | 'DEDUCT';
}

export interface DashboardPaidGroup {
  totals: Partial<DashboardTotals>;
  paymentModes: Record<string, number>;
  roundOff?: Partial<DashboardRoundOff>;
  charges?: { tax: number; serviceCharge: number; tip: number };
  discounts?: { total: number };
}

export interface DashboardDiscountGroup {
  total: number;
  manual: number;
  coinsUsed: number;
  coupon: number;
  npcAsDiscount: number;
  compAsDiscount: number;
}

export interface DashboardDiscountSummary {
  onPaid: Partial<DashboardDiscountGroup>;
  onDues: Partial<DashboardDiscountGroup>;
}

export interface DashboardTaxGroup {
  tax: number;
  serviceCharge: number;
  tip: number;
}

export interface DashboardTaxSummary {
  all: Partial<DashboardTaxGroup>;
  onPaid: Partial<DashboardTaxGroup>;
}

export interface DashboardRewardsGroup {
  coinsGiven: number;
}

export interface DashboardRewardsSummary {
  all: Partial<DashboardRewardsGroup>;
  onPaid: Partial<DashboardRewardsGroup>;
  onDues: Partial<DashboardRewardsGroup>;
}

export interface DashboardDuesSummary {
  duesGiven: number;
  duesOutstanding: number;
  ordersPending: number;
  duesGetBack: number;
}

export interface DashboardRunningTable {
  name: string;
  amount: number;
}

export interface DashboardRunningTables {
  tables: DashboardRunningTable[];
  totalActiveTableValue: number;
}

// ─── Normalised "overall" shape (compatibility / simplified read) ─────────────

export interface BillsDashboardOverall {
  totalSale: number;
  totalOrders: number;
  totalDiscount: number;
  totalTax: number;
  serviceCharge: number;
  tips: number;
  netIncome?: number;
  totalCharges?: number;
}

// ─── Full data shape ──────────────────────────────────────────────────────────

export interface BillsDashboardData {
  // Normalised (added by billsApi.getDashboard for backward compat)
  overall?: BillsDashboardOverall;
  paymentMethods?: Record<string, number>;

  // New nested structure
  paidAll?: DashboardPaidGroup;
  paidNormal?: DashboardPaidGroup;
  duesSettlements?: DashboardPaidGroup;
  discountSummary?: DashboardDiscountSummary;
  rewardsSummary?: DashboardRewardsSummary;
  duesSummary?: DashboardDuesSummary;
  taxesSummary?: DashboardTaxSummary;
  runningTables?: DashboardRunningTables;
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
