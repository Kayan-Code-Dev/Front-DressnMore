import type { ApiSuccess } from "@/shared/types/api";
import type { CashMovementItem } from "@/features/cash-movements/types/cash-movements.types";
import { cashMovementsFixture } from "@/features/cash-movements/mocks/cash-movements.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listCashMovementsMock(search = ""): Promise<ApiSuccess<CashMovementItem[]>> {
  await delay(220);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? cashMovementsFixture.filter((item) =>
        `${item.type} ${item.reference ?? ""} ${item.description ?? ""}`.toLowerCase().includes(normalized)
      )
    : cashMovementsFixture;

  return {
    success: true,
    message: "Success",
    data,
    meta: {
      total: data.length,
    },
  };
}
