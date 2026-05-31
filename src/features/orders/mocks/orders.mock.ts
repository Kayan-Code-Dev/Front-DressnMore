import type {
  DeliverySearchRow,
  DressOption,
  RentalOrder,
  RentalOrderStats,
} from "@/features/orders/types/orders.types";

export const rentalOrdersFixture: RentalOrder[] = [
  {
    id: 1001,
    client_name: "سارة أحمد",
    client_phone: "+201012345678",
    employee_name: "محمد علي",
    visit_date: "2026-05-01",
    delivery_date: "2026-05-03",
    return_date: "2026-05-10",
    total_price: 3500,
    paid: 2000,
    remaining: 1500,
    status: "active",
    items_count: 2,
    notes: "تسليم في الفرع الرئيسي",
    items: [
      { id: 1, cloth_name: "فستان سهرة ذهبي", cloth_code: "DR-001", size: "M", color: "ذهبي", rental_price: 2000, return_date: "2026-05-10" },
      { id: 2, cloth_name: "عباية مطرزة", cloth_code: "AB-014", size: "L", color: "أسود", rental_price: 1500, return_date: "2026-05-10" },
    ],
    payments: [
      { id: 1, amount: 1500, method: "cash", paid_at: "2026-05-01", notes: "عربون" },
      { id: 2, amount: 500, method: "card", paid_at: "2026-05-03" },
    ],
    custodies: [
      { id: 1, item_name: "بطاقة هوية", value: 0, status: "held", received_at: "2026-05-01" },
      { id: 2, item_name: "وديعة نقدية", value: 500, status: "held", received_at: "2026-05-01" },
    ],
  },
  {
    id: 1002,
    client_name: "نور حسن",
    client_phone: "+201098765432",
    employee_name: "فاطمة محمود",
    visit_date: "2026-04-20",
    delivery_date: "2026-04-22",
    return_date: "2026-04-28",
    total_price: 1800,
    paid: 1800,
    remaining: 0,
    status: "returned",
    items_count: 1,
    items: [
      { id: 3, cloth_name: "فستان زفاف", cloth_code: "WD-008", size: "S", color: "أبيض", rental_price: 1800, return_date: "2026-04-28" },
    ],
    payments: [{ id: 3, amount: 1800, method: "transfer", paid_at: "2026-04-20" }],
    custodies: [{ id: 3, item_name: "وديعة نقدية", value: 300, status: "returned", received_at: "2026-04-20" }],
  },
  {
    id: 1003,
    client_name: "مريم خالد",
    client_phone: "+201055566677",
    employee_name: "أحمد سعيد",
    visit_date: "2026-04-15",
    delivery_date: "2026-04-17",
    return_date: "2026-04-25",
    total_price: 4200,
    paid: 1000,
    remaining: 3200,
    status: "overdue",
    items_count: 3,
    items: [
      { id: 4, cloth_name: "فستان سهرة أزرق", cloth_code: "DR-022", size: "M", color: "أزرق", rental_price: 2200, return_date: "2026-04-25" },
      { id: 5, cloth_name: "شال حرير", cloth_code: "SH-003", size: "—", color: "فضي", rental_price: 500, return_date: "2026-04-25" },
      { id: 6, cloth_name: "حقيبة يد", cloth_code: "BG-011", size: "—", color: "ذهبي", rental_price: 1500, return_date: "2026-04-25" },
    ],
    payments: [{ id: 4, amount: 1000, method: "cash", paid_at: "2026-04-15" }],
    custodies: [],
  },
  {
    id: 1004,
    client_name: "هبة يوسف",
    client_phone: "+201033344455",
    employee_name: "محمد علي",
    visit_date: "2026-05-28",
    delivery_date: "2026-05-30",
    return_date: "2026-06-05",
    total_price: 2500,
    paid: 500,
    remaining: 2000,
    status: "pending",
    items_count: 1,
    items: [
      { id: 7, cloth_name: "فستان كocktail", cloth_code: "DR-045", size: "L", color: "وردي", rental_price: 2500, return_date: "2026-06-05" },
    ],
    payments: [{ id: 5, amount: 500, method: "cash", paid_at: "2026-05-28", notes: "حجز" }],
    custodies: [],
  },
  {
    id: 1005,
    client_name: "رانيا عادل",
    client_phone: "+201077788899",
    employee_name: "فاطمة محمود",
    visit_date: "2026-03-10",
    delivery_date: "2026-03-12",
    return_date: "2026-03-18",
    total_price: 1600,
    paid: 0,
    remaining: 1600,
    status: "cancelled",
    items_count: 1,
    items: [
      { id: 8, cloth_name: "فستان خطوبة", cloth_code: "DR-033", size: "M", color: "بيج", rental_price: 1600, return_date: "2026-03-18" },
    ],
    payments: [],
    custodies: [],
  },
];

export const dressOptionsFixture: DressOption[] = [
  { id: 1, name: "فستان سهرة ذهبي", code: "DR-001", category: "سهرة", size: "M", color: "ذهبي", rental_price: 2000, available: true },
  { id: 2, name: "فستان زفاف", code: "WD-008", category: "زفاف", size: "S", color: "أبيض", rental_price: 3500, available: true },
  { id: 3, name: "عباية مطرزة", code: "AB-014", category: "عبايات", size: "L", color: "أسود", rental_price: 1500, available: true },
  { id: 4, name: "فستان سهرة أزرق", code: "DR-022", category: "سهرة", size: "M", color: "أزرق", rental_price: 2200, available: false },
  { id: 5, name: "فستان cocktail", code: "DR-045", category: "كocktail", size: "L", color: "وردي", rental_price: 2500, available: true },
  { id: 6, name: "فستان خطوبة", code: "DR-033", category: "خطوبة", size: "M", color: "بيج", rental_price: 1600, available: true },
];

export const deliverySearchFixture: DeliverySearchRow[] = [
  { id: 1, order_id: 1001, client_name: "سارة أحمد", cloth_name: "فستان سهرة ذهبي", cloth_code: "DR-001", type: "delivery", scheduled_date: "2026-05-03", status: "done", employee_name: "محمد علي" },
  { id: 2, order_id: 1001, client_name: "سارة أحمد", cloth_name: "عباية مطرزة", cloth_code: "AB-014", type: "return", scheduled_date: "2026-05-10", status: "pending", employee_name: "محمد علي" },
  { id: 3, order_id: 1003, client_name: "مريم خالد", cloth_name: "فستان سهرة أزرق", cloth_code: "DR-022", type: "return", scheduled_date: "2026-04-25", status: "overdue", employee_name: "أحمد سعيد" },
  { id: 4, order_id: 1004, client_name: "هبة يوسف", cloth_name: "فستان cocktail", cloth_code: "DR-045", type: "delivery", scheduled_date: "2026-05-30", status: "pending", employee_name: "محمد علي" },
  { id: 5, order_id: 1002, client_name: "نور حسن", cloth_name: "فستان زفاف", cloth_code: "WD-008", type: "return", scheduled_date: "2026-04-28", status: "done", employee_name: "فاطمة محمود" },
];

export function computeRentalStats(orders: RentalOrder[]): RentalOrderStats {
  return {
    total: orders.length,
    active: orders.filter((o) => o.status === "active").length,
    overdue: orders.filter((o) => o.status === "overdue").length,
    revenue: orders.reduce((s, o) => s + o.total_price, 0),
    collected: orders.reduce((s, o) => s + o.paid, 0),
    remaining: orders.reduce((s, o) => s + o.remaining, 0),
  };
}
