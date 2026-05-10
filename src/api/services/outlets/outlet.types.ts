export interface OutletListItem {
  _id: string;
  name: string;
  registerName?: string;
  status?: boolean;
  outletImageUrl?: string;
  billingStartTime?: number;
  billingEndTime?: number;
}
