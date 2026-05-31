import type { ApiSuccess, ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type {
  CashboxFilterParams,
  CashboxItem,
  CashboxPayload,
  CashboxStats,
  CashboxTransaction,
} from "@/features/cashboxes/types/cashboxes.types";
import {
  cashboxesFixture,
  cashboxTransactionsFixture,
  computeCashboxStats,
} from "@/features/cashboxes/mocks/cashboxes.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let cashboxesStore = [...cashboxesFixture];

function paginate<T>(items: T[], page = 1, perPage = 6) {
  const total = items.length;
  const last_page = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  return {
    data: items.slice(start, start + perPage),
    meta: { total, last_page, current_page: page, per_page: perPage },
  };
}

function filterCashboxes(items: CashboxItem[], params: CashboxFilterParams) {
  const normalized = (params.search ?? "").trim().toLowerCase();

  return items.filter((item) => {
    if (normalized) {
      const haystack = [
        item.name,
        item.branch_name,
        item.manager_name,
        item.description,
        String(item.id),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(normalized)) return false;
    }
    if (params.branch_id && item.branch_id !== params.branch_id) return false;
    if (params.status === "active" && !item.is_active) return false;
    if (params.status === "inactive" && item.is_active) return false;
    if (params.is_active !== undefined && item.is_active !== params.is_active) return false;
    return true;
  });
}

export async function listCashboxesMock(
  params: ListQueryParams<CashboxFilterParams> = {},
): Promise<PaginatedResponse<CashboxItem>> {
  await delay(230);
  const page = params.page ?? 1;
  const perPage = params.per_page ?? 6;
  const filtered = filterCashboxes(cashboxesStore, params);
  const { data, meta } = paginate(filtered, page, perPage);
  return { success: true, message: "Success", data, meta };
}

export async function getCashboxStatsMock(): Promise<ApiSuccess<CashboxStats>> {
  await delay(150);
  return { success: true, message: "Success", data: computeCashboxStats(cashboxesStore) };
}

export async function getCashboxMock(id: number): Promise<ApiSuccess<CashboxItem | null>> {
  await delay(180);
  const data = cashboxesStore.find((item) => item.id === id) ?? null;
  return { success: true, message: "Success", data, meta: null };
}

export async function createCashboxMock(payload: CashboxPayload): Promise<ApiSuccess<CashboxItem>> {
  await delay(200);
  const nextId = Math.max(0, ...cashboxesStore.map((item) => item.id)) + 1;
  const initialBalance = Number(payload.initial_balance ?? 0);
  const item: CashboxItem = {
    id: nextId,
    name: payload.name,
    branch_id: payload.branch_id ?? null,
    branch_name: null,
    manager_name: null,
    initial_balance: initialBalance,
    current_balance: initialBalance,
    balance_change: 0,
    total_in: 0,
    total_out: 0,
    is_active: payload.is_active ?? true,
    description: payload.description ?? null,
    created_at: new Date().toISOString(),
  };
  cashboxesStore = [item, ...cashboxesStore];
  return { success: true, message: "Success", data: item, meta: null };
}

export async function updateCashboxMock(
  id: number,
  payload: CashboxPayload,
): Promise<ApiSuccess<CashboxItem>> {
  await delay(200);
  const index = cashboxesStore.findIndex((item) => item.id === id);
  if (index === -1) throw new Error("Cashbox not found");

  const existing = cashboxesStore[index];
  const initialBalance = Number(payload.initial_balance ?? existing.initial_balance);
  const totalIn = existing.total_in ?? 0;
  const totalOut = existing.total_out ?? 0;
  const currentBalance = initialBalance + totalIn - totalOut;
  const updated: CashboxItem = {
    ...existing,
    name: payload.name,
    branch_id: payload.branch_id ?? null,
    initial_balance: initialBalance,
    current_balance: currentBalance,
    balance_change: currentBalance - initialBalance,
    is_active: payload.is_active ?? existing.is_active,
    description: payload.description ?? null,
  };
  cashboxesStore[index] = updated;
  return { success: true, message: "Success", data: updated, meta: null };
}

export async function deleteCashboxMock(id: number): Promise<ApiSuccess<null>> {
  await delay(180);
  cashboxesStore = cashboxesStore.filter((item) => item.id !== id);
  return { success: true, message: "Success", data: null, meta: null };
}

export async function listCashboxTransactionsMock(
  cashboxId?: number,
  search = "",
): Promise<ApiSuccess<CashboxTransaction[]>> {
  await delay(220);
  const normalized = search.trim().toLowerCase();
  let data = cashboxId
    ? cashboxTransactionsFixture.filter((t) => t.cashbox_id === cashboxId)
    : [...cashboxTransactionsFixture];
  if (normalized) {
    data = data.filter((item) =>
      `${item.reference} ${item.description} ${item.created_by}`.toLowerCase().includes(normalized),
    );
  }
  return { success: true, message: "Success", data, meta: { total: data.length } };
}
