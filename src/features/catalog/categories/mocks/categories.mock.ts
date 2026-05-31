import type { CategoryItem } from "@/features/catalog/categories/types/categories.types";

export const categoriesFixture: CategoryItem[] = [
  { id: 1, name: "Wedding", description: "Wedding dresses collection", status: "active" },
  { id: 2, name: "Evening", description: "Evening and gala", status: "active" },
  { id: 3, name: "Classic", description: "Classic formal styles", status: "inactive" },
  { id: 4, name: "Party", description: "Party catalog", status: "active" },
];
