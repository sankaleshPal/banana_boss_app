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
