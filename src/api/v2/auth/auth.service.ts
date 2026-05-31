import { api } from "@/api/api-contants";
import { TLoginRequest, TLoginResponse } from "./auth.types";
import { populateError } from "@/api/api.utils";

export const loginApi = async (req: TLoginRequest) => {
  try {
    const { data } = await api.post<TLoginResponse>("/login", req);
    return data;
  } catch (error: any) {
    populateError(error, "خطأ فى تسجيل الدخول");
  }
};