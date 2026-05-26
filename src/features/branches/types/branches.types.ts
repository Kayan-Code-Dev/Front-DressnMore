export type BranchItem = {
  id: number;
  branch_code: string;
  name: string;
  phone: string;
  address: string;
  inventory_name: string;
  currency: string;
  vat: string;
  status: "active" | "inactive";
};
