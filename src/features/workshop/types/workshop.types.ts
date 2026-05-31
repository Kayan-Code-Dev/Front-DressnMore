export type WorkshopStatus = "active" | "closed" | "under_construction";

export type WorkshopItem = {
  id: number;
  workshop_code: string;
  name: string;
  city: string;
  address: string;
  inventory_name: string;
  status: WorkshopStatus;
  created_at: string;
};

export type WorkshopTransferItem = {
  id: number;
  workshop_id: number;
  transfer_code: string;
  from_branch: string;
  to_workshop: string;
  item_name: string;
  quantity: number;
  status: "pending" | "approved" | "rejected" | "completed";
  created_at: string;
};

export type WorkshopClothItem = {
  id: number;
  workshop_id: number;
  cloth_code: string;
  customer_name: string;
  product_name: string;
  workshop_status: "processing" | "received" | "ready_for_delivery";
  updated_at: string;
};
