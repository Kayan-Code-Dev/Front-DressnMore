import type { ApiSuccess } from "@/shared/types/api";
import type { PurchaseOrderItem, SupplierItem } from "@/features/suppliers/types/suppliers.types";
import { purchaseOrdersFixture, suppliersFixture } from "@/features/suppliers/mocks/suppliers.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listSuppliersMock(search = ""): Promise<ApiSuccess<SupplierItem[]>> {
  await delay(230);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? suppliersFixture.filter((item) =>
        `${item.code} ${item.name} ${item.phone} ${item.address}`.toLowerCase().includes(normalized)
      )
    : suppliersFixture;

  return {
    success: true,
    message: "Success",
    data,
    meta: {
      total: data.length,
    },
  };
}

export async function listPurchaseOrdersMock(search = ""): Promise<ApiSuccess<PurchaseOrderItem[]>> {
  await delay(240);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? purchaseOrdersFixture.filter((item) =>
        `${item.purchase_order_number} ${item.supplier} ${item.status}`
          .toLowerCase()
          .includes(normalized)
      )
    : purchaseOrdersFixture;

  return {
    success: true,
    message: "Success",
    data,
    meta: {
      total: data.length,
    },
  };
}
