import type { OutletListItem } from '@/api/services/outlets/outlet.types';

export interface StaffLoginItem {
  name: string;
  nickName: string;
  outletName: string;
  outletImageUrl: string;
  outletId: string;
  phone: string;
  roleName: string;
  bookMark: boolean;
  staffId: string;
}

export interface StaffLoginPayload {
  phone: string;
  password: string;
}

/* ─── Outlet Admin (email) login ─── */

export interface OutletAdminLoginPayload {
  email: string;
  password: string;
}

/**
 * POST /r/auth/login/outlet-admin — main admin gets ALL of their outlets at
 * once + their admin id (already unwrapped from the ApiResponse envelope).
 */
export interface OutletAdminLoginResponse {
  outlets: OutletListItem[];
  outletAdminId: string;
}
