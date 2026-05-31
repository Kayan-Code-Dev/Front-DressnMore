import type { ApiSuccess } from "@/shared/types/api";
import type { CashboxItem, CashboxTransaction } from "@/features/cashboxes/types/cashboxes.types";
import { cashboxesFixture, cashboxTransactionsFixture } from "@/features/cashboxes/mocks/cashboxes.mock";

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

export async function getCashboxMock(id: number): Promise<ApiSuccess<CashboxItem | null>> {
  await delay(180);
  const data = cashboxesFixture.find((item) => item.id === id) ?? null;
  return { success: true, message: "Success", data, meta: null };
}

export async function listCashboxTransactionsMock(
  cashboxId?: number,
  search = ""
): Promise<ApiSuccess<CashboxTransaction[]>> {
  await delay(220);
  const normalized = search.trim().toLowerCase();
  let data = cashboxId
    ? cashboxTransactionsFixture.filter((t) => t.cashbox_id === cashboxId)
    : [...cashboxTransactionsFixture];
  if (normalized) {
    data = data.filter((item) =>
      `${item.reference} ${item.description} ${item.created_by}`.toLowerCase().includes(normalized)
    );
  }
  return { success: true, message: "Success", data, meta: { total: data.length } };
}
