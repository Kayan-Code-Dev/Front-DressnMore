import type { ApiSuccess, ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type { ExpenseFilterParams, ExpenseItem, ExpenseSummary } from "@/features/expenses/types/expenses.types";
import { computeExpenseSummary, expensesFixture } from "@/features/expenses/mocks/expenses.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const PER_PAGE = 15;

function paginate<T>(items: T[], page = 1, perPage = PER_PAGE) {
  const total = items.length;
  const last_page = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  return { data: items.slice(start, start + perPage), meta: { total, last_page, current_page: page, per_page: perPage } };
}

function filterExpenses(items: ExpenseItem[], params: ExpenseFilterParams) {
  const normalized = (params.search ?? "").trim().toLowerCase();

  return items.filter((item) => {
    if (normalized) {
      const haystack = [
        item.category?.name,
        item.vendor,
        item.description,
        item.reference_number,
        item.notes,
        String(item.id),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(normalized)) return false;
    }
    if (params.status && item.status !== params.status) return false;
    if (params.expense_category_id && item.expense_category_id !== params.expense_category_id) return false;
    if (params.branch_id && item.branch_id !== params.branch_id) return false;
    if (params.cashbox_id && item.cashbox_id !== params.cashbox_id) return false;
    if (params.date_from && item.expense_date < params.date_from) return false;
    if (params.date_to && item.expense_date > params.date_to) return false;
    return true;
  });
}

export async function listExpensesMock(
  params: ListQueryParams<ExpenseFilterParams> = {},
): Promise<PaginatedResponse<ExpenseItem>> {
  await delay(240);
  const page = params.page ?? 1;
  const data = filterExpenses(expensesFixture, params);
  const { data: pageData, meta } = paginate(data, page);
  return { success: true, message: "Success", data: pageData, meta };
}

export async function getExpensesSummaryMock(): Promise<ApiSuccess<ExpenseSummary>> {
  await delay(150);
  return { success: true, message: "Success", data: computeExpenseSummary(expensesFixture) };
}
