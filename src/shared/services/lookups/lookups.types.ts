export type LookupOption = {
  value: string;
  label: string;
};

export type LookupsData = {
  customer_statuses: LookupOption[];
  customer_sources: LookupOption[];
  dress_statuses: LookupOption[];
  category_statuses: LookupOption[];
  invoice_types: LookupOption[];
  invoice_statuses: LookupOption[];
  payment_methods: LookupOption[];
  payment_statuses: LookupOption[];
  payment_types: LookupOption[];
  security_deposit_statuses: LookupOption[];
  inventory_movement_types: LookupOption[];
  delivery_record_types: LookupOption[];
  expense_statuses: LookupOption[];
  branch_statuses: LookupOption[];
  vat_types: LookupOption[];
  cashbox_statuses: LookupOption[];
  supplier_statuses: LookupOption[];
  purchase_order_statuses: LookupOption[];
  report_periods: LookupOption[];
  cash_movement_types: LookupOption[];
  cash_movement_directions: LookupOption[];
  dress_status_after_return: LookupOption[];
};
