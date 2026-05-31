import type { DressItem } from "@/features/catalog/dresses/types/dresses.types";

export const dressesFixture: DressItem[] = [
  { id: 1, code: "DR-1001", name: "Classic Black", category: "Evening", branch: "Cairo", status: "ready" },
  { id: 2, code: "DR-1002", name: "Royal Blue", category: "Wedding", branch: "Alexandria", status: "reserved" },
  { id: 3, code: "DR-1003", name: "Pearl White", category: "Wedding", branch: "Giza", status: "maintenance" },
  { id: 4, code: "DR-1004", name: "Emerald Green", category: "Party", branch: "Cairo", status: "ready" },
];
