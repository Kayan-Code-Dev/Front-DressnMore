import type {
  BranchInventoryItem,
  InventoryHubSection,
  InventoryTransferItem,
} from "@/features/inventory/types/inventory.types";

export const inventoryHubSectionsFixture: InventoryHubSection[] = [
  {
    id: "branches",
    title: "مخزون الفروع",
    description: "عرض وإدارة الأصناف في مخازن الفروع",
    path: "/inventory/branches",
  },
  {
    id: "employees",
    title: "مخزون الموظفين",
    description: "عرض وإدارة عهد ومخزون الموظفين",
    path: "/inventory/employees",
  },
  {
    id: "transfers",
    title: "عمليات التحويل",
    description: "إدارة طلبات تحويل المخزون بين الفروع",
    path: "/inventory/transfers",
  },
];

export const branchInventoryFixture: BranchInventoryItem[] = [
  {
    id: 1,
    item_name: "قماش ساتان أبيض",
    category: "أقمشة",
    subcategory: "ساتان",
    quantity: 150,
    branch_name: "Cairo Main",
    status: "accepted",
    updated_at: "2025-05-28",
  },
  {
    id: 2,
    item_name: "أزرار لؤلؤية",
    category: "إكسسوارات",
    subcategory: "أزرار",
    quantity: 500,
    branch_name: "Alex Branch",
    status: "pending",
    updated_at: "2025-05-29",
  },
  {
    id: 3,
    item_name: "فستان جاهز — مقاس M",
    category: "فساتين",
    subcategory: "سهرة",
    quantity: 12,
    branch_name: "Mansoura Branch",
    status: "arrived",
    updated_at: "2025-05-30",
  },
  {
    id: 4,
    item_name: "قماش مخمل أسود",
    category: "أقمشة",
    subcategory: "مخمل",
    quantity: 80,
    branch_name: "Cairo Main",
    status: "rejected",
    updated_at: "2025-05-25",
  },
];

export const inventoryTransfersFixture: InventoryTransferItem[] = [
  {
    id: 1,
    uuid: "tr-001-abc",
    from_branch: "Cairo Main",
    to_branch: "Alex Branch",
    item_name: "قماش ساتان أبيض",
    quantity: 30,
    status: "pending",
    created_at: "2025-05-29",
  },
  {
    id: 2,
    uuid: "tr-002-def",
    from_branch: "Alex Branch",
    to_branch: "Mansoura Branch",
    item_name: "أزرار لؤلؤية",
    quantity: 100,
    status: "accepted",
    created_at: "2025-05-28",
  },
  {
    id: 3,
    uuid: "tr-003-ghi",
    from_branch: "Mansoura Branch",
    to_branch: "Cairo Main",
    item_name: "فستان جاهز — مقاس M",
    quantity: 5,
    status: "arrived",
    created_at: "2025-05-27",
  },
];
