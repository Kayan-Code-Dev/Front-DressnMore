export type DressItem = {
  id: number;
  code: string;
  name: string;
  category: string;
  branch: string;
  status: "ready" | "reserved" | "maintenance";
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
