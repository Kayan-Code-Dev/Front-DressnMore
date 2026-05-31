import type { CategoryItem } from "@/features/catalog/categories/types/categories.types";

export const categoriesFixture: CategoryItem[] = [
  { id: 1, parent_id: null, name: "Wedding", slug: "wedding", description: "Wedding dresses collection", status: "active" },
  { id: 2, parent_id: null, name: "Evening", slug: "evening", description: "Evening and gala", status: "active" },
  { id: 3, parent_id: null, name: "Classic", slug: "classic", description: "Classic formal styles", status: "inactive" },
  { id: 4, parent_id: null, name: "Party", slug: "party", description: "Party catalog", status: "active" },
];
