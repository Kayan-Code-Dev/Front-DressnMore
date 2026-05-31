import type { AccountingSummary, LedgerEntry, TreasuryEntry } from "@/features/accounting/types/accounting.types";

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

export const treasuryEntriesFixture: TreasuryEntry[] = [
  {
    id: 1,
    entry_number: "JE-2026-0142",
    date: "2026-05-30",
    account: "الصندوق الرئيسي",
    description: "تحصيل إيجار فساتين",
    debit: 8500,
    credit: 0,
    status: "posted",
    created_by: "أحمد محمد",
  },
  {
    id: 2,
    entry_number: "JE-2026-0141",
    date: "2026-05-29",
    account: "مصروفات تشغيلية",
    description: "فاتورة كهرباء",
    debit: 0,
    credit: 1200,
    status: "posted",
    created_by: "سارة علي",
  },
  {
    id: 3,
    entry_number: "JE-2026-0140",
    date: "2026-05-28",
    account: "موردين",
    description: "دفعة مورد أقمشة",
    debit: 0,
    credit: 6000,
    status: "draft",
    created_by: "منى حسن",
  },
  {
    id: 4,
    entry_number: "JE-2026-0139",
    date: "2026-05-27",
    account: "إيرادات خياطة",
    description: "إيراد خدمة تفصيل",
    debit: 3200,
    credit: 0,
    status: "posted",
    created_by: "أحمد محمد",
  },
  {
    id: 5,
    entry_number: "JE-2026-0138",
    date: "2026-05-26",
    account: "مصروفات صيانة",
    description: "صيانة معدات — ملغى",
    debit: 0,
    credit: 450,
    status: "cancelled",
    created_by: "سارة علي",
  },
];
