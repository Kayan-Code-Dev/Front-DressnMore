import type { DressItem } from "@/features/catalog/dresses/types/dresses.types";

export function dressDisplayName(row: Pick<DressItem, "code" | "display_name" | "category" | "subcategory">): string {
  if (row.display_name?.trim()) {
    return row.display_name;
  }

  const parts = [row.code, row.category?.name, row.subcategory?.name].filter(
    (value): value is string => typeof value === "string" && value.trim() !== "",
  );

  return parts.join("-");
}
