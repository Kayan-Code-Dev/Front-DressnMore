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

export type BranchFilterParams = {
  status?: string;
  city_id?: number;
  currency_id?: number;
};
