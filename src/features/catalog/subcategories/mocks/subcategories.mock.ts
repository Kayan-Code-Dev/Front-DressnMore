import type { SubcategoryItem } from "@/features/catalog/subcategories/types/subcategories.types";

export const subcategoriesFixture: SubcategoryItem[] = [
  { id: 1, parent_id: 1, name: "A-Line", slug: "a-line", description: "A-line fit", status: "active", parent: { id: 1, name: "Wedding" }, category_name: "Wedding" },
  { id: 2, parent_id: 1, name: "Mermaid", slug: "mermaid", description: "Mermaid shape", status: "active", parent: { id: 1, name: "Wedding" }, category_name: "Wedding" },
  { id: 3, parent_id: 2, name: "Long Sleeve", slug: "long-sleeve", description: "Long sleeve style", status: "inactive", parent: { id: 2, name: "Evening" }, category_name: "Evening" },
  { id: 4, parent_id: 3, name: "Minimal", slug: "minimal", description: "Minimal cut", status: "active", parent: { id: 3, name: "Classic" }, category_name: "Classic" },
];
