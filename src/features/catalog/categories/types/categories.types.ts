export type CategoryItem = {
  id: number;
  name: string;
  description: string;
  status: "active" | "inactive";
};

export type DressCategoryFilterParams = {
  status?: string;
  parent_id?: number;
  only_parents?: boolean;
  only_children?: boolean;
};
