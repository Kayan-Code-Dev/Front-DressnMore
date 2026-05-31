import type { ApiSuccess } from "@/shared/types/api";
import type { PaymentItem } from "@/features/payments/types/payments.types";
import { paymentsFixture } from "@/features/payments/mocks/payments.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listPaymentsMock(search = ""): Promise<ApiSuccess<PaymentItem[]>> {
  await delay(240);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? paymentsFixture.filter((item) =>
        `${item.invoice_id} ${item.payment_type} ${item.status} ${item.notes ?? ""}`
          .toLowerCase()
          .includes(normalized)
      )
    : paymentsFixture;

  return {
    success: true,
    message: "Success",
    data,
    meta: {
      total: data.length,
    },
  };
}
