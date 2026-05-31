import { httpClient } from "@/shared/lib/http/client";
import { tenantPath } from "@/config/api";
import type { ApiSuccess } from "@/shared/types/api";
import type {
  PurchaseOrderItem,
  SupplierPaymentItem,
} from "@/features/suppliers/types/suppliers.types";

export type SupplierStatementLine = {
  id: number;
  date: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
};

export type SupplierReturnLine = {
  id: number;
  return_number: string;
  date: string;
  amount: number;
  reason: string;
};

export type SupplierAccountSummary = {
  supplier: {
    id: number;
    code: string;
    name: string;
    current_balance: number;
    status: string;
  };
  purchase_orders: PurchaseOrderItem[];
  payments: SupplierPaymentItem[];
  returns: SupplierReturnLine[];
  statement: SupplierStatementLine[];
};

export async function getSupplierAccount(supplierId: number): Promise<ApiSuccess<SupplierAccountSummary>> {
  const response = await httpClient.get<SupplierAccountSummary>(
    tenantPath(`/suppliers/${supplierId}/account`),
  );
  return httpClient.unwrap(response);
}
