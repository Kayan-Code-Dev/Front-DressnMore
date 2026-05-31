import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import { buildQueryString } from "@/shared/lib/http/query";
import type { ListQueryParams, PaginatedResponse } from "@/shared/types/api";
import type { SupplierPaymentItem } from "@/features/suppliers/types/suppliers.types";

type ApiSupplierPayment = {
  id: number;
  supplier?: string | { name?: string };
  purchase_order_number?: string | null;
  amount: number;
  method?: string | null;
  reference?: string | null;
  paid_at?: string | null;
  notes?: string | null;
};

function mapSupplierPayment(row: ApiSupplierPayment): SupplierPaymentItem {
  const supplier =
    typeof row.supplier === "string"
      ? row.supplier
      : row.supplier?.name ?? "";

  return {
    id: row.id,
    supplier,
    purchase_order_number: row.purchase_order_number ?? "—",
    amount: Number(row.amount),
    method: (row.method as SupplierPaymentItem["method"]) ?? "cash",
    reference: row.reference ?? "",
    paid_at: row.paid_at ? row.paid_at.slice(0, 10) : "",
    notes: row.notes ?? "",
  };
}

export async function listSupplierPayments(
  params: ListQueryParams = {},
): Promise<PaginatedResponse<SupplierPaymentItem>> {
  const qs = buildQueryString(params as Record<string, string | number | boolean | null | undefined>);
  const response = await httpClient.get<ApiSupplierPayment[]>(tenantPath(`/supplier-payments${qs}`));
  const unwrapped = httpClient.unwrap(response) as PaginatedResponse<ApiSupplierPayment>;

  return {
    ...unwrapped,
    data: (unwrapped.data ?? []).map(mapSupplierPayment),
  };
}
