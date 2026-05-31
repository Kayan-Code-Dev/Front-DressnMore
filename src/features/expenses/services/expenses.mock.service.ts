import type { ApiSuccess } from "@/shared/types/api";
import type { ExpenseItem } from "@/features/expenses/types/expenses.types";
import { expensesFixture } from "@/features/expenses/mocks/expenses.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listExpensesMock(search = ""): Promise<ApiSuccess<ExpenseItem[]>> {
  await delay(240);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? expensesFixture.filter((item) =>
        `${item.branch} ${item.cashbox} ${item.category} ${item.vendor}`.toLowerCase().includes(normalized)
      )
    : expensesFixture;

  return {
    success: true,
    message: "Success",
    data,
    meta: {
      total: data.length,
    },
  };
}
