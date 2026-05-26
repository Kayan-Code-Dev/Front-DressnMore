import type { ApiSuccess } from "@/shared/types/api";
import type { DressItem } from "@/features/catalog/dresses/types/dresses.types";
import { dressesFixture } from "@/features/catalog/dresses/mocks/dresses.mock.data";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listDressesMock(search = ""): Promise<ApiSuccess<DressItem[]>> {
  await delay(280);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? dressesFixture.filter((item) =>
        `${item.code} ${item.name} ${item.category}`.toLowerCase().includes(normalized)
      )
    : dressesFixture;

  return {
    success: true,
    message: "Success",
    data,
    meta: {
      total: data.length,
    },
  };
}
