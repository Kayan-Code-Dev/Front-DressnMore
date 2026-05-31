export type InventoryItemStatus = "pending" | "accepted" | "rejected" | "arrived";

export type BranchInventoryItem = {
  id: number;
  item_name: string;
  category: string;
  subcategory: string;
  quantity: number;
  branch_name: string;
  status: InventoryItemStatus;
  updated_at: string;
};

export type InventoryTransferItem = {
  id: number;
  uuid: string;
  from_branch: string;
  to_branch: string;
  item_name: string;
  quantity: number;
  status: InventoryItemStatus;
  created_at: string;
};

export type InventoryHubSection = {
  id: string;
  title: string;
  description: string;
  path: string;
};
