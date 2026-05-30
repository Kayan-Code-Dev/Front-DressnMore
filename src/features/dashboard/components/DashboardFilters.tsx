import type { DashboardFilterParams } from "@/features/dashboard/types/dashboard.types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/custom/DatePicker";

type DashboardFiltersProps = {
  filters: DashboardFilterParams;
  onChange: (next: DashboardFilterParams) => void;
};

const periodOptions = [
  { value: "today", label: "اليوم" },
  { value: "week", label: "هذا الأسبوع" },
  { value: "month", label: "هذا الشهر" },
  { value: "last_month", label: "الشهر الماضي" },
  { value: "year", label: "هذه السنة" },
];

export function DashboardFilters({ filters, onChange }: DashboardFiltersProps) {
  return (
    <div
      className="rounded-2xl border p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      style={{ background: "white", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="space-y-2">
        <Label className="text-xs font-bold">الفترة</Label>
        <Select
          value={filters.period ?? "month"}
          onValueChange={(value) =>
            onChange({ ...filters, period: value as DashboardFilterParams["period"] })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="اختر الفترة" />
          </SelectTrigger>
          <SelectContent>
            {periodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold">من تاريخ</Label>
        <DatePicker
          value={filters.date_from}
          onChange={(date_from) => onChange({ ...filters, date_from })}
          placeholder="تاريخ البداية"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold">إلى تاريخ</Label>
        <DatePicker
          value={filters.date_to}
          onChange={(date_to) => onChange({ ...filters, date_to })}
          placeholder="تاريخ النهاية"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold">الفرع</Label>
        <Select
          value={filters.branch_id ? String(filters.branch_id) : "all"}
          onValueChange={(value) =>
            onChange({
              ...filters,
              branch_id: value === "all" ? undefined : Number(value),
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="كل الفروع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الفروع</SelectItem>
            <SelectItem value="1">الفرع الرئيسي</SelectItem>
            <SelectItem value="2">فرع مدينة نصر</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
