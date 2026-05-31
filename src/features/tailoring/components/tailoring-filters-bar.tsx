import type { TailoringFilterParams, TailoringOrderStatus, TailoringPriority, TailoringStage } from "@/features/tailoring/types/tailoring.types";
import { KANBAN_STAGES } from "@/features/tailoring/constants/tailoring.constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/shared/utils/cn";
import { Search, LayoutGrid, List } from "lucide-react";

interface TailoringFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filters: TailoringFilterParams;
  onFiltersChange: (filters: TailoringFilterParams) => void;
  viewMode: "kanban" | "list";
  onViewModeChange: (mode: "kanban" | "list") => void;
  resultCount: number;
}

const statusChips: { key: TailoringOrderStatus | "all"; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "active", label: "نشط" },
  { key: "completed", label: "منجز" },
  { key: "overdue", label: "متأخر" },
  { key: "cancelled", label: "ملغي" },
];

const priorityChips: { key: TailoringPriority | "all"; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "VIP", label: "VIP" },
  { key: "urgent", label: "عاجل" },
  { key: "normal", label: "عادي" },
];

export function TailoringFiltersBar({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  resultCount,
}: TailoringFiltersBarProps) {
  const setStatus = (status: TailoringOrderStatus | "all") => onFiltersChange({ ...filters, status });
  const setPriority = (priority: TailoringPriority | "all") => onFiltersChange({ ...filters, priority });
  const setStage = (stage: TailoringStage | "all") => onFiltersChange({ ...filters, stage });

  return (
    <div className="rounded-xl border bg-white p-4 space-y-3 shadow-sm" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث بالاسم أو الرقم أو نوع الثوب..."
            className="pr-9"
          />
        </div>

        <Select value={filters.stage ?? "all"} onValueChange={(v) => setStage(v as TailoringStage | "all")}>
          <SelectTrigger className="w-full lg:w-[180px]">
            <SelectValue placeholder="جميع المراحل" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع المراحل</SelectItem>
            {KANBAN_STAGES.map((s) => (
              <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground whitespace-nowrap">{resultCount} نتيجة</span>
          <Button
            variant={viewMode === "kanban" ? "default" : "outline"}
            size="icon"
            className="h-9 w-9"
            onClick={() => onViewModeChange("kanban")}
            title="عرض Kanban"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            className="h-9 w-9"
            onClick={() => onViewModeChange("list")}
            title="عرض قائمة"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
        <span className="text-xs text-muted-foreground w-full sm:w-auto mb-1 sm:mb-0">الأولوية:</span>
        {priorityChips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => setPriority(chip.key)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
              (filters.priority ?? "all") === chip.key
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-white text-muted-foreground border-border hover:border-pink-300",
            )}
          >
            {chip.label}
          </button>
        ))}

        <span className="text-xs text-muted-foreground w-full sm:w-auto sm:mr-3 mb-1 sm:mb-0">الحالة:</span>
        {statusChips.map((chip) => (
          <button
            key={chip.key}
            type="button"
            onClick={() => setStatus(chip.key)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
              (filters.status ?? "all") === chip.key
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-muted-foreground border-border hover:border-blue-300",
            )}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
