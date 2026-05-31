import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { getPlansPublic, postOrderPlanPublic } from "./plans.service";

export const PUBLIC_PLANS_KEY = "PUBLIC_PLANS";

export const usePublicPlansQueryOptions = (page = 1) =>
  queryOptions({
    queryKey: [PUBLIC_PLANS_KEY, page],
    queryFn: () => getPlansPublic(page),
    staleTime: 1000 * 60 * 10,
  });

export const useOrderPlanMutationOptions = () =>
  mutationOptions({
    mutationFn: postOrderPlanPublic,
  });
