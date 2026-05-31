import type { LookupsData } from "./lookups.types";

export const lookupsFixture: LookupsData = {
  customer_statuses: [
    { value: "active", label: "Active" },
    { value: "vip", label: "VIP" },
    { value: "inactive", label: "Inactive" },
  ],
  customer_sources: [
    { value: "walk_in", label: "Walk-in" },
    { value: "referral", label: "Referral" },
    { value: "online", label: "Online" },
  ],
  dress_statuses: [
    { value: "ready", label: "Ready" },
    { value: "reserved", label: "Reserved" },
    { value: "maintenance", label: "Maintenance" },
  ],
  category_statuses: [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ],
  invoice_types: [
    { value: "rent", label: "Rent" },
    { value: "sale", label: "Sale" },
    { value: "tailoring", label: "Tailoring" },
  ],
  invoice_statuses: [
    { value: "draft", label: "Draft" },
    { value: "open", label: "Open" },
    { value: "paid", label: "Paid" },
    { value: "cancelled", label: "Cancelled" },
  ],
  payment_methods: [
    { value: "cash", label: "Cash" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "check", label: "Check" },
  ],
  payment_statuses: [
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "cancelled", label: "Cancelled" },
  ],
  payment_types: [
    { value: "initial", label: "Initial" },
    { value: "normal", label: "Normal" },
    { value: "fee", label: "Fee" },
  ],
  security_deposit_statuses: [
    { value: "held", label: "Held" },
    { value: "returned", label: "Returned" },
    { value: "forfeited", label: "Forfeited" },
  ],
  inventory_movement_types: [
    { value: "in", label: "In" },
    { value: "out", label: "Out" },
    { value: "transfer", label: "Transfer" },
  ],
  delivery_record_types: [
    { value: "delivery", label: "Delivery" },
    { value: "pickup", label: "Pickup" },
  ],
  expense_statuses: [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "paid", label: "Paid" },
    { value: "cancelled", label: "Cancelled" },
  ],
  branch_statuses: [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ],
  vat_types: [
    { value: "inclusive", label: "Inclusive" },
    { value: "exclusive", label: "Exclusive" },
    { value: "none", label: "None" },
  ],
  cashbox_statuses: [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ],
  supplier_statuses: [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ],
  purchase_order_statuses: [
    { value: "open", label: "Open" },
    { value: "partially_paid", label: "Partially Paid" },
    { value: "paid", label: "Paid" },
    { value: "returned", label: "Returned" },
  ],
  report_periods: [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ],
  cash_movement_types: [
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
  ],
  cash_movement_directions: [
    { value: "in", label: "In" },
    { value: "out", label: "Out" },
  ],
  dress_status_after_return: [
    { value: "ready", label: "Ready" },
    { value: "maintenance", label: "Maintenance" },
  ],
};
