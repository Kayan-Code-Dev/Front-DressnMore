import type { ApiSuccess } from "@/shared/types/api";
import type {
  BranchInventoryItem,
  InventoryHubSection,
  InventoryTransferItem,
} from "@/features/inventory/types/inventory.types";
import {
  branchInventoryFixture,
  inventoryHubSectionsFixture,
  inventoryTransfersFixture,
} from "@/features/inventory/mocks/inventory.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listInventoryHubSectionsMock(): Promise<ApiSuccess<InventoryHubSection[]>> {
  await delay(150);
  return { success: true, message: "Success", data: inventoryHubSectionsFixture };
}

export async function listBranchInventoryMock(
  search = ""
): Promise<ApiSuccess<BranchInventoryItem[]>> {
  await delay(220);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? branchInventoryFixture.filter(
        (item) =>
          item.item_name.toLowerCase().includes(normalized) ||
          item.branch_name.toLowerCase().includes(normalized) ||
          item.category.toLowerCase().includes(normalized)
      )
    : branchInventoryFixture;
  return { success: true, message: "Success", data, meta: { total: data.length } };
}

export async function listInventoryTransfersMock(
  search = ""
): Promise<ApiSuccess<InventoryTransferItem[]>> {
  await delay(220);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? inventoryTransfersFixture.filter(
        (item) =>
          item.item_name.toLowerCase().includes(normalized) ||
          item.from_branch.toLowerCase().includes(normalized) ||
          item.to_branch.toLowerCase().includes(normalized)
      )
    : inventoryTransfersFixture;
  return { success: true, message: "Success", data, meta: { total: data.length } };
}
