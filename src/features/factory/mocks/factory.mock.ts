import type { FactoryItem } from "@/features/factory/types/factory.types";

export const factoriesFixture: FactoryItem[] = [
  {
    id: 1,
    factory_code: "FAC-001",
    name: "مصنع التفصيل المركزي",
    city: "القاهرة",
    address: "العبور الصناعية — المنطقة B",
    inventory_name: "مخزن المصنع الرئيسي",
    status: "active",
    created_at: "2022-08-01",
  },
  {
    id: 2,
    factory_code: "FAC-002",
    name: "مصنع الإنتاج الشمالي",
    city: "الإسكندرية",
    address: "برج العرب — المنطقة الصناعية",
    inventory_name: "مخزن مصنع الإسكندرية",
    status: "active",
    created_at: "2023-03-15",
  },
  {
    id: 3,
    factory_code: "FAC-003",
    name: "مصنع دلتا",
    city: "المنصورة",
    address: "طريق السنبلاوين",
    inventory_name: "مخزن مصنع دلتا",
    status: "closed",
    created_at: "2021-01-10",
  },
];
