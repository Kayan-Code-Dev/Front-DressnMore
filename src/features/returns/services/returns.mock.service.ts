import type { ApiSuccess } from "@/shared/types/api";
import type { ReturnItem } from "@/features/returns/types/returns.types";
import { returnsFixture } from "@/features/returns/mocks/returns.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listReturnsMock(search = ""): Promise<ApiSuccess<ReturnItem[]>> {
  await delay(230);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? returnsFixture.filter((item) =>
        `${item.order_id} ${item.client} ${item.employee} ${item.cloth_name} ${item.cloth_code}`
          .toLowerCase()
          .includes(normalized)
      )
    : returnsFixture;

  return {
    success: true,
    message: "Success",
    data,
    meta: {
      total: data.length,
    },
  };
}
