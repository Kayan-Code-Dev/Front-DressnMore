export type DressStatus = "available" | "rented" | "sold" | "maintenance" | "unavailable";

export type DressCategoryRef = {
  id: number;
  name: string;
};

export type DressBranchRef = {
  id: number;
  name: string;
};

export type DressItem = {
  id: number;
  code: string;
  name: string;
  dress_category_id: number | null;
  branch_id: number | null;
  status: DressStatus;
  display_name?: string;
  category?: DressCategoryRef | null;
  branch?: DressBranchRef | null;
};

export type DressFilterParams = {
  id?: number;
  name?: string;
  code?: string;
  dress_category_id?: number;
  dress_subcategory_id?: number;
  category_id?: number;
  subcat_id?: number;
  branch_id?: number;
  entity_type?: string;
  entity_id?: number;
  status?: string;
  color?: string;
  size?: string;
  created_from?: string;
  created_to?: string;
  delivery_date?: string;
  days_of_rent?: number;
  occasion_datetime?: string;
  visit_datetime?: string;
};

export type DressPayload = {
  code: string;
  name: string;
  dress_category_id?: number | null;
  dress_subcategory_id?: number | null;
  branch_id?: number | null;
  status?: DressStatus;
  description?: string | null;
  color?: string | null;
  size?: string | null;
  rental_price?: number | null;
  sale_price?: number | null;
  notes?: string | null;
};
