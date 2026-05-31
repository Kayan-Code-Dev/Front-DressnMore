import type { ApiSuccess } from "@/shared/types/api";
import type { LoginFormValues, MockLoginResult } from "@/features/auth/types/auth.types";
import { mockLoginData } from "@/features/auth/mocks/auth.mock.data";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockTenantLogin(payload: LoginFormValues): Promise<ApiSuccess<MockLoginResult>> {
  await delay(350);

  return {
    success: true,
    message: "Success",
    data: {
      ...mockLoginData,
      user: {
        ...mockLoginData.user,
        email: payload.email,
      },
    },
    meta: null,
  };
}
