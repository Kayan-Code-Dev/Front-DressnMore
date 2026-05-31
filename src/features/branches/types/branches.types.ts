export type BranchItem = {
  id: number;
  branch_code: string;
  name: string;
  phone: string | null;
  address: string | null;
  inventory_name: string | null;
  currency: string | null;
  vat_enabled?: boolean;
  vat_type?: string | null;
  vat_value?: number | null;
  status: "active" | "inactive";
  created_at?: string;
};

export type BranchFilterParams = {
  status?: string;
  city_id?: number;
  currency_id?: number;
};

export type BranchPayload = {
  branch_code?: string | null;
  name: string;
  phone?: string | null;
  address?: string | null;
  inventory_name?: string | null;
  currency?: string | null;
  status?: "active" | "inactive";
};
