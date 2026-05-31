import type { ApiSuccess } from "@/shared/types/api";
import type { CategoryItem } from "@/features/catalog/categories/types/categories.types";
import { categoriesFixture } from "@/features/catalog/categories/mocks/categories.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listCategoriesMock(search = ""): Promise<ApiSuccess<CategoryItem[]>> {
  await delay(220);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? categoriesFixture.filter((item) =>
        `${item.name} ${item.description}`.toLowerCase().includes(normalized)
      )
    : categoriesFixture;

  return {
    success: true,
    message: "Success",
    data,
    meta: {
      total: data.length,
    },
  };
}
