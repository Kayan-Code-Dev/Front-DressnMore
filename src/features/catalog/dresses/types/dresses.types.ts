export type DressStatus = "available" | "rented" | "sold" | "maintenance" | "unavailable";

export type DressCategoryRef = {
  id: number;
  name: string;
};

export type DressItem = {
  id: number;
  code: string;
  name: string;
  dress_category_id: number | null;
  dress_subcategory_id: number | null;
  status: DressStatus;
  description: string | null;
  display_name?: string;
  category?: DressCategoryRef | null;
  subcategory?: DressCategoryRef | null;
};

export type DressFilterParams = {
  id?: number;
  name?: string;
  code?: string;
  dress_category_id?: number;
  dress_subcategory_id?: number;
  category_id?: number;
  subcat_id?: number;
  status?: string;
  created_from?: string;
  created_to?: string;
};

export type DressPayload = {
  code: string;
  dress_category_id: number;
  dress_subcategory_id: number;
  description?: string | null;
  status?: DressStatus;
};
