import type { ApiSuccess } from "@/shared/types/api";
import type { CashboxItem } from "@/features/cashboxes/types/cashboxes.types";
import { cashboxesFixture } from "@/features/cashboxes/mocks/cashboxes.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listCashboxesMock(search = ""): Promise<ApiSuccess<CashboxItem[]>> {
  await delay(230);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? cashboxesFixture.filter((item) =>
        `${item.name} ${item.branch} ${item.description}`.toLowerCase().includes(normalized)
      )
    : cashboxesFixture;

  return {
    success: true,
    message: "Success",
    data,
    meta: {
      total: data.length,
    },
  };
}
