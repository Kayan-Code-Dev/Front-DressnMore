import type { ExpenseItem, ExpenseSummary } from "@/features/expenses/types/expenses.types";

const categories = [
  { id: 1, name: "تشغيل", slug: "operating" },
  { id: 2, name: "تسويق", slug: "marketing" },
  { id: 3, name: "مرافق", slug: "utilities" },
  { id: 4, name: "رواتب", slug: "salaries" },
  { id: 5, name: "صيانة", slug: "maintenance" },
];

const vendors = ["إيجار المكتب", "Meta Ads", "شركة الكهرباء", "مورد أقمشة", "صيانة أجهزة", "رواتب شهرية", "إعلانات", "مياه", "نقل", "تنظيف", "قرطاسية", "استضافة", "تأمين", "ضيافة", "أدوات"];

export const expensesFixture: ExpenseItem[] = Array.from({ length: 15 }, (_, i) => {
  const id = i + 1;
  const cat = categories[i % categories.length];
  const status: ExpenseItem["status"] = id <= 6 ? "paid" : id <= 11 ? "pending" : id <= 13 ? "approved" : "cancelled";
  const amount = [12000, 3400, 2100, 8500, 4200, 1800, 5600, 2900, 3700, 1500, 6200, 2400, 3100, 980, 4500][i];

  return {
    id,
    expense_category_id: cat.id,
    branch_id: (id % 3) + 1,
    cashbox_id: (id % 2) + 1,
    category: { id: cat.id, name: cat.name, slug: cat.slug, status: "active" },
    amount,
    status,
    method: id % 2 === 0 ? "cash" : "bank_transfer",
    vendor: vendors[i],
    reference: null,
    reference_number: `EXP-${String(id).padStart(4, "0")}`,
    expense_date: `2026-05-${String(Math.min(28, 5 + id)).padStart(2, "0")}`,
    description: id % 3 === 0 ? "مصروف دوري" : null,
    notes: id === 1 ? "دفع إيجار مايو" : null,
    transaction_id: status === "paid" ? `TXN-${id}` : null,
    paid_at: status === "paid" ? `2026-05-${String(Math.min(28, 6 + id)).padStart(2, "0")}T12:00:00Z` : null,
    created_at: `2026-05-${String(Math.min(28, 4 + id)).padStart(2, "0")}T10:00:00Z`,
  };
});

export function computeExpenseSummary(items: ExpenseItem[]): ExpenseSummary {
  return {
    total_amount: items.reduce((s, e) => s + e.amount, 0),
    pending_amount: items.filter((e) => e.status === "pending").reduce((s, e) => s + e.amount, 0),
    approved_amount: items.filter((e) => e.status === "approved").reduce((s, e) => s + e.amount, 0),
    paid_amount: items.filter((e) => e.status === "paid").reduce((s, e) => s + e.amount, 0),
    cancelled_amount: items.filter((e) => e.status === "cancelled").reduce((s, e) => s + e.amount, 0),
    total_count: items.length,
  };
}

export const expenseCategoriesFixture = categories.map((c) => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  description: null,
  status: "active",
}));
