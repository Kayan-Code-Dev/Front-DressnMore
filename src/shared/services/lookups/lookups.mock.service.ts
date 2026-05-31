import type { ApiSuccess } from "@/shared/types/api";
import type { LookupsData } from "./lookups.types";
import { lookupsFixture } from "./lookups.mock.data";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchLookups(): Promise<ApiSuccess<LookupsData>> {
  await delay(200);

  return {
    success: true,
    message: "Lookups loaded",
    data: { ...lookupsFixture },
    meta: null,
  };
}
