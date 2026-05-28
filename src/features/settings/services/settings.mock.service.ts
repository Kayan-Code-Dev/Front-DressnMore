import type { ApiSuccess } from "@/shared/types/api";
import type { AccountProfile } from "@/features/settings/types/settings.types";
import { accountSettingsFixture } from "@/features/settings/mocks/settings.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAccountSettingsMock(): Promise<ApiSuccess<AccountProfile>> {
  await delay(160);
  return {
    success: true,
    message: "Success",
    data: accountSettingsFixture,
    meta: null,
  };
}
