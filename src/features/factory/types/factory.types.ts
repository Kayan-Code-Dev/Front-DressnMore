export type FactoryStatus = "active" | "closed" | "under_construction";

export type FactoryItem = {
  id: number;
  factory_code: string;
  name: string;
  city: string;
  address: string;
  inventory_name: string;
  status: FactoryStatus;
  created_at: string;
};
