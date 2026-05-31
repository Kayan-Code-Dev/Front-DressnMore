import type {
  DailySalesRow,
  EmployeeSalesRow,
  ProductSalesRow,
  SaleInvoice,
  SalesReportSummary,
} from "@/features/sales/types/sales.types";

export const salesInvoicesFixture: SaleInvoice[] = [
  {
    id: 501,
    client_name: "سارة أحمد",
    employee_name: "محمد علي",
    branch_name: "الفرع الرئيسي",
    sale_date: "2026-05-28",
    payment_method: "cash",
    subtotal: 3200,
    discount: 200,
    total: 3000,
    items: [
      { id: 1, product_name: "وشاح حرير", product_code: "ACC-012", quantity: 2, unit_price: 800, total: 1600 },
      { id: 2, product_name: "حقيبة يد", product_code: "BG-011", quantity: 1, unit_price: 1600, total: 1600 },
    ],
  },
  {
    id: 502,
    client_name: "نور حسن",
    employee_name: "فاطمة محمود",
    branch_name: "فرع المعادي",
    sale_date: "2026-05-27",
    payment_method: "card",
    subtotal: 5500,
    discount: 0,
    total: 5500,
    items: [
      { id: 3, product_name: "فستان جاهز", product_code: "RD-045", quantity: 1, unit_price: 5500, total: 5500 },
    ],
  },
  {
    id: 503,
    client_name: "مريم خالد",
    employee_name: "محمد علي",
    branch_name: "الفرع الرئيسي",
    sale_date: "2026-05-26",
    payment_method: "transfer",
    subtotal: 1800,
    discount: 100,
    total: 1700,
    items: [
      { id: 4, product_name: "إكسسوار شعر", product_code: "ACC-008", quantity: 3, unit_price: 600, total: 1800 },
    ],
  },
  {
    id: 504,
    client_name: "هبة يوسف",
    employee_name: "أحمد سعيد",
    branch_name: "فرع المعادي",
    sale_date: "2026-05-25",
    payment_method: "cash",
    subtotal: 4200,
    discount: 0,
    total: 4200,
    items: [
      { id: 5, product_name: "عباية جاهزة", product_code: "AB-020", quantity: 1, unit_price: 4200, total: 4200 },
    ],
  },
  {
    id: 505,
    client_name: "رانيا عادل",
    employee_name: "فاطمة محمود",
    branch_name: "الفرع الرئيسي",
    sale_date: "2026-05-24",
    payment_method: "card",
    subtotal: 2400,
    discount: 400,
    total: 2000,
    items: [
      { id: 6, product_name: "حذاء كعب", product_code: "SH-003", quantity: 1, unit_price: 2400, total: 2400 },
    ],
  },
];

export function computeSalesSummary(invoices: SaleInvoice[]): SalesReportSummary {
  const total_sales = invoices.reduce((s, i) => s + i.total, 0);
  const invoices_count = invoices.length;
  return {
    total_sales,
    invoices_count,
    average_invoice_value: invoices_count > 0 ? total_sales / invoices_count : 0,
  };
}

export const dailySalesFixture: DailySalesRow[] = [
  { date: "2026-05-24", invoices_count: 3, total: 8200 },
  { date: "2026-05-25", invoices_count: 2, total: 5900 },
  { date: "2026-05-26", invoices_count: 4, total: 11200 },
  { date: "2026-05-27", invoices_count: 2, total: 7500 },
  { date: "2026-05-28", invoices_count: 3, total: 9700 },
];

export const productSalesFixture: ProductSalesRow[] = [
  { product_name: "فستان جاهز", product_code: "RD-045", quantity_sold: 8, revenue: 44000 },
  { product_name: "عباية جاهزة", product_code: "AB-020", quantity_sold: 5, revenue: 21000 },
  { product_name: "وشاح حرير", product_code: "ACC-012", quantity_sold: 12, revenue: 9600 },
  { product_name: "حقيبة يد", product_code: "BG-011", quantity_sold: 6, revenue: 9600 },
  { product_name: "حذاء كعب", product_code: "SH-003", quantity_sold: 4, revenue: 9600 },
];

export const employeeSalesFixture: EmployeeSalesRow[] = [
  { employee_name: "محمد علي", invoices_count: 12, total_sales: 48500 },
  { employee_name: "فاطمة محمود", invoices_count: 9, total_sales: 36200 },
  { employee_name: "أحمد سعيد", invoices_count: 7, total_sales: 22800 },
];

export const saleProductOptions = [
  { id: 1, name: "وشاح حرير", code: "ACC-012", price: 800 },
  { id: 2, name: "حقيبة يد", code: "BG-011", price: 1600 },
  { id: 3, name: "فستان جاهز", code: "RD-045", price: 5500 },
  { id: 4, name: "إكسسوار شعر", code: "ACC-008", price: 600 },
  { id: 5, name: "عباية جاهزة", code: "AB-020", price: 4200 },
  { id: 6, name: "حذاء كعب", code: "SH-003", price: 2400 },
];
