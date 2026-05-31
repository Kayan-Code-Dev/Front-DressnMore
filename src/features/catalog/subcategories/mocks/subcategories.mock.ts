import type { SubcategoryItem } from "@/features/catalog/subcategories/types/subcategories.types";

export const subcategoriesFixture: SubcategoryItem[] = [
  { id: 1, name: "A-Line", category_name: "Wedding", description: "A-line fit", status: "active" },
  { id: 2, name: "Mermaid", category_name: "Wedding", description: "Mermaid shape", status: "active" },
  { id: 3, name: "Long Sleeve", category_name: "Evening", description: "Long sleeve style", status: "inactive" },
  { id: 4, name: "Minimal", category_name: "Classic", description: "Minimal cut", status: "active" },
];
