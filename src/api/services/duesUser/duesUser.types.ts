export interface DuesUser {
  _id: string;
  name: string;
  phone?: string;
  status: boolean;
  currentDuesAmount: number;
}
