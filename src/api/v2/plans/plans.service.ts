import { api } from "@/api/api-contants";
import { TOrderPlanRequest, TPlansPaginatedResponse } from "./plans.types";

export const getPlansPublic = async (page = 1) => {
  const { data } = await api.get<TPlansPaginatedResponse>("/plans", {
    params: { page },
  });
  return data;
};

export const postOrderPlanPublic = async (body: TOrderPlanRequest) => {
  const { data } = await api.post<unknown>("/order-plans", body);
  return data;
};
