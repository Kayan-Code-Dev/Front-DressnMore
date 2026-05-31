import type { CashMovementItem } from "@/features/cash-movements/types/cash-movements.types";

export const cashMovementsFixture: CashMovementItem[] = [
  {
    id: 1,
    type: "income",
    direction: "in",
    amount: 1500,
    balance_after: 25000,
    method: "cash",
    cashbox_id: 1,
    reference: "PAY-9001",
    movement_date: "2026-06-02T10:20:00Z",
    description: "تحصيل دفعة",
    notes: null,
    is_reversed: false,
    created_at: "2026-06-02T10:20:00Z",
  },
  {
    id: 2,
    type: "expense",
    direction: "out",
    amount: 600,
    balance_after: 24400,
    method: "cash",
    cashbox_id: 1,
    reference: "EXP-1003",
    movement_date: "2026-06-02T12:15:00Z",
    description: "مصروف تشغيلي",
    notes: null,
    is_reversed: false,
    created_at: "2026-06-02T12:15:00Z",
  },
];
