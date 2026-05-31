import type { PaymentItem, PaymentStats } from "@/features/payments/types/payments.types";

const customers = [
  "نور الهدى محمد",
  "نهى رضا",
  "رشا عصام",
  "مها الشمري",
  "سارة علي",
  "فاطمة الغامدي",
  "خلود القحطاني",
  "ريم العتيبي",
  "دانا الفارس",
  "لمياء حسن",
  "بشاير الدوسري",
  "نورة الزهراني",
  "هند السبيعي",
  "رانيا عادل",
  "هبة يوسف",
];

const branches = ["الفرع الرئيسي", "الفرع الثاني", "الفرع الثالث"];

function pad(n: number, len = 3) {
  return String(n).padStart(len, "0");
}

export const paymentsFixture: PaymentItem[] = Array.from({ length: 15 }, (_, i) => {
  const id = i + 1;
  const status: PaymentItem["status"] = id <= 8 ? "paid" : id <= 13 ? "pending" : "cancelled";
  const methods = ["cash", "bank_transfer", "card"] as const;
  const method = methods[id % 3];
  const amount = [4500, 3200, 4100, 2800, 6100, 1900, 5500, 3700, 2400, 4800, 3300, 2900, 4200, 1500, 5200][i];

  return {
    id,
    payment_number: `PAY-2026-${pad(id)}`,
    invoice_number: `INV-2026-${pad(45 - i + 12)}`,
    invoice_id: 1000 + id,
    customer_id: (id % 10) + 1,
    branch_id: (id % 3) + 1,
    customer_name: customers[i],
    branch_name: branches[id % 3],
    amount,
    status,
    payment_type: id % 4 === 0 ? "initial" : id % 5 === 0 ? "fee" : "normal",
    method,
    reference: method === "bank_transfer" ? `REF-${pad(id)}` : null,
    paid_at: status === "paid" ? `2026-05-${pad(Math.min(28, 10 + id))}T10:00:00Z` : null,
    cancelled_at: status === "cancelled" ? `2026-05-${pad(Math.min(28, 12 + id))}T11:00:00Z` : null,
    notes: id === 1 ? "دفعة أولى 60%" : id === 5 ? "تحويل بنكي مؤكد" : id === 9 ? "—" : null,
    created_at: `2026-05-${pad(Math.min(28, 5 + id))}T09:00:00Z`,
  };
});

export function computePaymentStats(items: PaymentItem[]): PaymentStats {
  return {
    total_count: items.length,
    total_amount: items.reduce((s, p) => s + p.amount, 0),
    collected_amount: items.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0),
    pending_amount: items.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0),
    paid_count: items.filter((p) => p.status === "paid").length,
    pending_count: items.filter((p) => p.status === "pending").length,
    cancelled_count: items.filter((p) => p.status === "cancelled").length,
  };
}
