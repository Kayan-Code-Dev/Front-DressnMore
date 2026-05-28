import type { ApiSuccess } from "@/shared/types/api";
import type { BranchItem } from "@/features/branches/types/branches.types";
import { branchesFixture } from "@/features/branches/mocks/branches.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listBranchesMock(search = ""): Promise<ApiSuccess<BranchItem[]>> {
  await delay(220);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? branchesFixture.filter((item) =>
        `${item.branch_code} ${item.name} ${item.phone} ${item.address}`
          .toLowerCase()
          .includes(normalized)
      )
    : branchesFixture;

  return {
    success: true,
    message: "Success",
    data,
    meta: {
      total: data.length,
    },
  };
}
