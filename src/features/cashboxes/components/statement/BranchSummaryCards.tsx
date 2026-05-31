import type { BranchSummary } from "@/features/cashboxes/types/statement.types";
import { formatNumber } from "@/shared/lib/format/numbers";
import {
  Building2,
  Factory,
  Home,
  MapPin,
  Store,
  Wrench,
} from "lucide-react";

const iconMap = {
  all: Store,
  building: Building2,
  warehouse: Building2,
  home: Home,
  tools: Wrench,
  factory: Factory,
};

interface BranchSummaryCardsProps {
  branches: BranchSummary[];
  selectedId: number | "all";
  onSelect: (id: number | "all") => void;
}

export function BranchSummaryCards({ branches, selectedId, onSelect }: BranchSummaryCardsProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm space-y-3" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-emerald-600" />
        <div>
          <p className="font-bold text-sm">عرض حسب الفرع</p>
          <p className="text-xs text-muted-foreground">اختر الفرع لعرض أرصدته وحركاته</p>
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {branches.map((branch) => {
          const Icon = iconMap[branch.icon];
          const active = selectedId === branch.id;
          return (
            <button
              key={String(branch.id)}
              type="button"
              onClick={() => onSelect(branch.id)}
              className={`min-w-[140px] shrink-0 rounded-xl border p-3 text-right transition-colors ${
                active
                  ? "border-emerald-400 bg-emerald-50 shadow-sm"
                  : "border-muted bg-white hover:bg-muted/30"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${active ? "bg-emerald-500" : "bg-muted-foreground/30"}`}
                />
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-emerald-600" : "text-muted-foreground"}`} />
              </div>
              <p className="font-bold text-sm truncate">{branch.name}</p>
              <p className={`text-sm font-black mt-1 ${branch.balance < 0 ? "text-red-600" : "text-foreground"}`}>
                {formatNumber(branch.balance)} ج.م
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">{branch.entry_count} قيد</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
