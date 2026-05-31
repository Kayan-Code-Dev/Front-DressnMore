import type { ApiSuccess } from "@/shared/types/api";
import type { FactoryItem } from "@/features/factory/types/factory.types";
import { factoriesFixture } from "@/features/factory/mocks/factory.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listFactoriesMock(search = ""): Promise<ApiSuccess<FactoryItem[]>> {
  await delay(220);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? factoriesFixture.filter(
        (f) =>
          f.name.includes(search) ||
          f.factory_code.toLowerCase().includes(normalized) ||
          f.city.includes(search)
      )
    : factoriesFixture;
  return { success: true, message: "Success", data, meta: { total: data.length } };
}
