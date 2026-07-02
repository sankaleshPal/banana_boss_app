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

export interface DashboardRewardsSummary {
  all: { coinsEarned?: number; coinsUsed?: number };
  onPaid: { coinsEarned?: number; coinsUsed?: number };
  onDues: { coinsEarned?: number; coinsUsed?: number };
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

/** A live running table from the dedicated running-tables endpoint (has tableId). */
export interface PosRunningTable {
  tableId: string;
  tableName: string;
  tableCurrentAmount: number;
}

export interface PosRunningTablesData {
  posOnline: boolean;
  totalActiveTableValue: number;
  tables: PosRunningTable[];
}

/** A KOT synced from the local POS (for running-table KOT drill-down). */
export interface TableKot {
  _id: string;
  tableId: string;
  /** PLACED | PREPARING | READY | SERVED | CANCELLED | SETTLED */
  status: string;
  kotType?: string;
  kotInvoiceNumber: number;
  createdAt: number;
  [key: string]: unknown;
}

/** A single line item on a KOT. */
export interface KotItemLine {
  _id: string;
  kotId: string;
  itemName: string;
  quantity: number;
  itemPrice: number;
  status?: string;
  [key: string]: unknown;
}

export interface BillsDashboardOverall {
  totalSale: number;
  totalOrders: number;
  totalDiscount: number;
  totalTax: number;
  serviceCharge: number;
  tips: number;
}

export interface BillsDashboardData {
  overall?: BillsDashboardOverall;
  paymentMethods?: Record<string, number>;
  paidAll?: DashboardPaidGroup;
  paidNormal?: DashboardPaidGroup;
  duesSettlements?: DashboardPaidGroup;
  discountSummary?: DashboardDiscountSummary;
  rewardsSummary?: DashboardRewardsSummary;
  duesSummary?: DashboardDuesSummary;
  taxesSummary?: DashboardTaxSummary;
  runningTables?: DashboardRunningTables;
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

export interface BillsListPage {
  data: BillListItem[];
  total: number;
  page: number;
  limit: number;
}
