import type {
  WorkshopClothItem,
  WorkshopItem,
  WorkshopTransferItem,
} from "@/features/workshop/types/workshop.types";

export const workshopsFixture: WorkshopItem[] = [
  {
    id: 1,
    workshop_code: "WS-001",
    name: "ورشة التفصيل الرئيسية",
    city: "القاهرة",
    address: "مدينة نصر — شارع عباس العقاد",
    inventory_name: "مخزن الورشة الرئيسي",
    status: "active",
    created_at: "2023-01-15",
  },
  {
    id: 2,
    workshop_code: "WS-002",
    name: "ورشة الإسكندرية",
    city: "الإسكندرية",
    address: "سموحة — شارع فوزي معاذ",
    inventory_name: "مخزن ورشة الإسكندرية",
    status: "active",
    created_at: "2023-06-20",
  },
  {
    id: 3,
    workshop_code: "WS-003",
    name: "ورشة المنصورة",
    city: "المنصورة",
    address: "وسط البلد — شارع الجمهورية",
    inventory_name: "مخزن ورشة المنصورة",
    status: "under_construction",
    created_at: "2024-11-01",
  },
];

export const workshopTransfersFixture: WorkshopTransferItem[] = [
  {
    id: 1,
    workshop_id: 1,
    transfer_code: "WT-001",
    from_branch: "Cairo Main",
    to_workshop: "ورشة التفصيل الرئيسية",
    item_name: "قماش ساتان",
    quantity: 50,
    status: "completed",
    created_at: "2025-05-10",
  },
  {
    id: 2,
    workshop_id: 1,
    transfer_code: "WT-002",
    from_branch: "Alex Branch",
    to_workshop: "ورشة التفصيل الرئيسية",
    item_name: "أزرار ذهبية",
    quantity: 200,
    status: "pending",
    created_at: "2025-05-28",
  },
  {
    id: 3,
    workshop_id: 2,
    transfer_code: "WT-003",
    from_branch: "Mansoura Branch",
    to_workshop: "ورشة الإسكندرية",
    item_name: "قماش مخمل",
    quantity: 30,
    status: "approved",
    created_at: "2025-05-25",
  },
];

export const workshopClothsFixture: WorkshopClothItem[] = [
  {
    id: 1,
    workshop_id: 1,
    cloth_code: "CL-1001",
    customer_name: "نورا أحمد",
    product_name: "فستان سهرة",
    workshop_status: "processing",
    updated_at: "2025-05-29",
  },
  {
    id: 2,
    workshop_id: 1,
    cloth_code: "CL-1002",
    customer_name: "مريم خالد",
    product_name: "عباية مطرزة",
    workshop_status: "ready_for_delivery",
    updated_at: "2025-05-30",
  },
];
