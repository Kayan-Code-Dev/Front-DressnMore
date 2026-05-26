import type { ApiSuccess } from "@/shared/types/api";
import type { CustomerItem } from "@/features/customers/types/customers.types";
import { customersFixture } from "@/features/customers/mocks/customers.mock.data";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listCustomersMock(search = ""): Promise<ApiSuccess<CustomerItem[]>> {
  await delay(250);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? customersFixture.filter((item) => item.name.toLowerCase().includes(normalized))
    : customersFixture;

  return {
    success: true,
    message: "Success",
    data,
    meta: {
      total: data.length,
    },
  };
}
