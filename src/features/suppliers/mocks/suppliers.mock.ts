import type {
  PurchaseOrderItem,
  SupplierItem,
  SupplierPaymentItem,
} from "@/features/suppliers/types/suppliers.types";

export const suppliersFixture: SupplierItem[] = [
  {
    id: 1,
    code: "SUP-001",
    name: "Golden Fabrics",
    phone: "+201123456700",
    address: "Cairo Textile District",
    current_balance: 18000,
    status: "active",
  },
  {
    id: 2,
    code: "SUP-002",
    name: "Royal Threads",
    phone: "+201123456701",
    address: "Alex Industrial Zone",
    current_balance: 7200,
    status: "active",
  },
  {
    id: 3,
    code: "SUP-003",
    name: "Classic Tools",
    phone: "+201123456702",
    address: "Giza Warehouse Area",
    current_balance: 0,
    status: "inactive",
  },
];

export const purchaseOrdersFixture: PurchaseOrderItem[] = [
  {
    id: 1,
    purchase_order_number: "PO-1001",
    supplier: "Golden Fabrics",
    status: "open",
    total: 32000,
    paid_amount: 12000,
    remaining_amount: 20000,
    order_date: "2026-06-01",
  },
  {
    id: 2,
    purchase_order_number: "PO-1002",
    supplier: "Royal Threads",
    status: "partially_paid",
    total: 14000,
    paid_amount: 9000,
    remaining_amount: 5000,
    order_date: "2026-06-03",
  },
  {
    id: 3,
    purchase_order_number: "PO-1003",
    supplier: "Classic Tools",
    status: "paid",
    total: 6000,
    paid_amount: 6000,
    remaining_amount: 0,
    order_date: "2026-06-05",
  },
];

export const supplierPaymentsFixture: SupplierPaymentItem[] = [
  {
    id: 1,
    supplier: "Golden Fabrics",
    purchase_order_number: "PO-1001",
    amount: 6000,
    method: "bank_transfer",
    reference: "TXN-8701",
    paid_at: "2026-06-02",
    notes: "First transfer",
  },
  {
    id: 2,
    supplier: "Royal Threads",
    purchase_order_number: "PO-1002",
    amount: 3000,
    method: "cash",
    reference: "CASH-112",
    paid_at: "2026-06-04",
    notes: "Partial payment",
  },
];
