import type { ApiSuccess } from "@/shared/types/api";
import type { DeliveryItem } from "@/features/delivery/types/deliveries.types";
import { deliveriesFixture } from "@/features/delivery/mocks/deliveries.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listDeliveriesMock(search = ""): Promise<ApiSuccess<DeliveryItem[]>> {
  await delay(230);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? deliveriesFixture.filter((item) =>
        `${item.order_id} ${item.client} ${item.employee} ${item.cloth_name} ${item.cloth_code}`
          .toLowerCase()
          .includes(normalized)
      )
    : deliveriesFixture;

  return {
    success: true,
    message: "Success",
    data,
    meta: {
      total: data.length,
    },
  };
}
