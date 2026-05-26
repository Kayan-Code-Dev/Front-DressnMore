import type { CashMovementItem } from "@/features/cash-movements/types/cash-movements.types";

export const cashMovementsFixture: CashMovementItem[] = [
  {
    id: 1,
    cashbox: "Main Cashbox",
    type: "income",
    category: "payment",
    amount: 1500,
    balance_after: 25000,
    reference: "PAY-9001",
    created_at: "2026-06-02T10:20:00Z",
  },
  {
    id: 2,
    cashbox: "Main Cashbox",
    type: "expense",
    category: "expense",
    amount: 600,
    balance_after: 24400,
    reference: "EXP-1003",
    created_at: "2026-06-02T12:15:00Z",
  },
];
