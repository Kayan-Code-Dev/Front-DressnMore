import type { ReactNode } from "react";
import { Input } from "@/shared/ui/input";

type SearchFiltersBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  rightSlot?: ReactNode;
};

export function SearchFiltersBar({
  search,
  onSearchChange,
  searchPlaceholder = "Search",
  rightSlot,
}: SearchFiltersBarProps) {
  return (
    <div className="filters-bar">
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
      />
      {rightSlot ? <div className="filters-actions">{rightSlot}</div> : null}
    </div>
  );
}
