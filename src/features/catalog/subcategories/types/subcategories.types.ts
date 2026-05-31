import type { CategoryItem } from "@/features/catalog/categories/types/categories.types";

export type SubcategoryItem = CategoryItem & {
  category_name?: string;
};
