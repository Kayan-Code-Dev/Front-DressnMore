import type { ApiSuccess } from "@/shared/types/api";
import type { InvoiceItem } from "@/features/invoices/types/invoices.types";
import { invoicesFixture } from "@/features/invoices/mocks/invoices.mock.data";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listInvoicesMock(search = ""): Promise<ApiSuccess<InvoiceItem[]>> {
  await delay(260);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? invoicesFixture.filter((item) =>
        `${item.invoice_number} ${item.customer_id} ${item.type} ${item.status}`
          .toLowerCase()
          .includes(normalized)
      )
    : invoicesFixture;

  return {
    success: true,
    message: "Success",
    data,
    meta: {
      total: data.length,
    },
  };
}
