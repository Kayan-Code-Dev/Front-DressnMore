import type { DressItem } from "@/features/catalog/dresses/types/dresses.types";

export const dressesFixture: DressItem[] = [
  { id: 1, code: "DR-1001", name: "Classic Black", dress_category_id: 2, branch_id: 1, status: "available", category: { id: 2, name: "Evening" }, branch: { id: 1, name: "Cairo" } },
  { id: 2, code: "DR-1002", name: "Royal Blue", dress_category_id: 1, branch_id: 2, status: "rented", category: { id: 1, name: "Wedding" }, branch: { id: 2, name: "Alexandria" } },
  { id: 3, code: "DR-1003", name: "Pearl White", dress_category_id: 1, branch_id: 3, status: "maintenance", category: { id: 1, name: "Wedding" }, branch: { id: 3, name: "Giza" } },
  { id: 4, code: "DR-1004", name: "Emerald Green", dress_category_id: 4, branch_id: 1, status: "available", category: { id: 4, name: "Party" }, branch: { id: 1, name: "Cairo" } },
];
