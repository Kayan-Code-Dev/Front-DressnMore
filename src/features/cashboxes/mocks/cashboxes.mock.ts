import type { CashboxItem } from "@/features/cashboxes/types/cashboxes.types";

export const cashboxesFixture: CashboxItem[] = [
  {
    id: 1,
    name: "Main Cashbox",
    branch: "Cairo Main",
    initial_balance: 10000,
    current_balance: 24300,
    is_active: true,
    description: "Primary branch cashbox",
  },
  {
    id: 2,
    name: "Alex Cashbox",
    branch: "Alex Branch",
    initial_balance: 5000,
    current_balance: 8900,
    is_active: true,
    description: "Secondary branch cashbox",
  },
  {
    id: 3,
    name: "Old Cashbox",
    branch: "Mansoura Branch",
    initial_balance: 3000,
    current_balance: 1200,
    is_active: false,
    description: "Legacy cashbox",
  },
];
