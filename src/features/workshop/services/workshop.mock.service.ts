import type { ApiSuccess } from "@/shared/types/api";
import type {
  WorkshopClothItem,
  WorkshopItem,
  WorkshopTransferItem,
} from "@/features/workshop/types/workshop.types";
import {
  workshopClothsFixture,
  workshopTransfersFixture,
  workshopsFixture,
} from "@/features/workshop/mocks/workshop.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listWorkshopsMock(search = ""): Promise<ApiSuccess<WorkshopItem[]>> {
  await delay(220);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? workshopsFixture.filter(
        (w) =>
          w.name.includes(search) ||
          w.workshop_code.toLowerCase().includes(normalized) ||
          w.city.includes(search)
      )
    : workshopsFixture;
  return { success: true, message: "Success", data, meta: { total: data.length } };
}

export async function getWorkshopMock(id: number): Promise<ApiSuccess<WorkshopItem | null>> {
  await delay(180);
  return {
    success: true,
    message: "Success",
    data: workshopsFixture.find((w) => w.id === id) ?? null,
  };
}

export async function listWorkshopTransfersMock(
  workshopId: number
): Promise<ApiSuccess<WorkshopTransferItem[]>> {
  await delay(200);
  const data = workshopTransfersFixture.filter((t) => t.workshop_id === workshopId);
  return { success: true, message: "Success", data, meta: { total: data.length } };
}

export async function listWorkshopClothsMock(
  workshopId: number
): Promise<ApiSuccess<WorkshopClothItem[]>> {
  await delay(200);
  const data = workshopClothsFixture.filter((c) => c.workshop_id === workshopId);
  return { success: true, message: "Success", data, meta: { total: data.length } };
}
