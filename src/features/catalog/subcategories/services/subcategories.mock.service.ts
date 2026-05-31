import type { ApiSuccess } from "@/shared/types/api";
import type { SubcategoryItem } from "@/features/catalog/subcategories/types/subcategories.types";
import { subcategoriesFixture } from "@/features/catalog/subcategories/mocks/subcategories.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listSubcategoriesMock(search = ""): Promise<ApiSuccess<SubcategoryItem[]>> {
  await delay(240);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? subcategoriesFixture.filter((item) =>
        `${item.name} ${item.category_name} ${item.description}`.toLowerCase().includes(normalized)
      )
    : subcategoriesFixture;

  return {
    success: true,
    message: "Success",
    data,
    meta: {
      total: data.length,
    },
  };
}
