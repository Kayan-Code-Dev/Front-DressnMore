import type { AccountingSummary, LedgerEntry } from "@/features/accounting/types/accounting.types";

export const accountingSummaryFixture: AccountingSummary = {
  total_income: 420000,
  total_expenses: 186000,
  net_change: 234000,
  cashbox_balances: [
    { name: "Main Cashbox", balance: 24300 },
    { name: "Alex Cashbox", balance: 8900 },
  ],
};

export const accountingLedgerFixture: LedgerEntry[] = [
  {
    id: 1,
    date: "2026-06-01",
    type: "credit",
    reference: "PAY-9001",
    description: "Customer payment",
    debit: 0,
    credit: 1500,
    balance: 25000,
  },
  {
    id: 2,
    date: "2026-06-02",
    type: "debit",
    reference: "EXP-1003",
    description: "Electricity expense",
    debit: 600,
    credit: 0,
    balance: 24400,
  },
];
