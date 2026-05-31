export type CategoryItem = {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string | null;
  description: string | null;
  status: "active" | "inactive";
  parent?: { id: number; name: string } | null;
};

export type DressCategoryFilterParams = {
  status?: string;
  parent_id?: number;
  only_parents?: boolean;
  only_children?: boolean;
};

export type CategoryPayload = {
  parent_id?: number | null;
  name: string;
  slug?: string | null;
  description?: string | null;
  status?: "active" | "inactive";
};
