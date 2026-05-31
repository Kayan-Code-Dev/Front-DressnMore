import type { ExpenseItem } from "@/features/expenses/types/expenses.types";

export const expensesFixture: ExpenseItem[] = [
  {
    id: 1,
    branch: "Cairo Main",
    cashbox: "Main Cashbox",
    category: "Operating",
    vendor: "Rent Office",
    amount: 12000,
    expense_date: "2026-06-01",
    status: "approved",
  },
  {
    id: 2,
    branch: "Alex Branch",
    cashbox: "Alex Cashbox",
    category: "Marketing",
    vendor: "Meta Ads",
    amount: 3400,
    expense_date: "2026-06-02",
    status: "pending",
  },
  {
    id: 3,
    branch: "Cairo Main",
    cashbox: "Main Cashbox",
    category: "Utilities",
    vendor: "Electricity Co",
    amount: 2100,
    expense_date: "2026-06-04",
    status: "paid",
  },
];
