import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RotateCcw, FileSpreadsheet, FileText, Plus } from "lucide-react";

export type FinanceFilterSelect = {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

interface FinanceListFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  selects: [FinanceFilterSelect, FinanceFilterSelect, FinanceFilterSelect];
  dateFrom?: string;
  dateTo?: string;
  onDateFromChange?: (value: string) => void;
  onDateToChange?: (value: string) => void;
  onReset?: () => void;
  resultCount?: number;
  totalCount?: number;
  onExportExcel?: () => void;
  onExportPdf?: () => void;
  primaryAction?: { label: string; onClick: () => void; disabled?: boolean };
}

export function FinanceListFiltersBar({
  search,
  onSearchChange,
  searchPlaceholder = "بحث...",
  selects,
  dateFrom = "",
  dateTo = "",
  onDateFromChange,
  onDateToChange,
  onReset,
  resultCount = 0,
  totalCount = 0,
  onExportExcel,
  onExportPdf,
  primaryAction,
}: FinanceListFiltersBarProps) {
  return (
    <div className="rounded-xl border bg-white p-4 space-y-4 shadow-sm overflow-x-hidden" style={{ borderColor: "var(--color-border)" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground">بحث</Label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder={searchPlaceholder} className="pr-9" />
          </div>
        </div>
        {selects.map((field) => (
          <div key={field.id} className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground">{field.label}</Label>
            <Select value={field.value || "all"} onValueChange={(v) => field.onChange(v === "all" ? "" : v)}>
              <SelectTrigger className="w-full"><SelectValue placeholder={field.placeholder ?? "الكل"} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {field.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pt-1 border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-end gap-3">
          <div className="space-y-1.5 min-w-[140px]">
            <Label className="text-xs text-muted-foreground">من تاريخ</Label>
            <Input type="date" value={dateFrom} onChange={(e) => onDateFromChange?.(e.target.value)} dir="ltr" />
          </div>
          <div className="space-y-1.5 min-w-[140px]">
            <Label className="text-xs text-muted-foreground">إلى تاريخ</Label>
            <Input type="date" value={dateTo} onChange={(e) => onDateToChange?.(e.target.value)} dir="ltr" />
          </div>
          {onReset && (
            <Button type="button" variant="outline" size="sm" onClick={onReset} className="sm:mb-0.5">
              <RotateCcw className="h-4 w-4 ml-1.5" />إعادة ضبط
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap text-center sm:text-right">
            يعرض {resultCount} من {totalCount} سجل
          </span>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
            {onExportPdf && (
              <Button type="button" variant="outline" size="sm" className="text-red-600 border-red-200 bg-red-50/50" onClick={onExportPdf}>
                <FileText className="h-4 w-4 ml-1" />تصدير PDF
              </Button>
            )}
            {onExportExcel && (
              <Button type="button" variant="outline" size="sm" className="text-green-700 border-green-200 bg-green-50/50" onClick={onExportExcel}>
                <FileSpreadsheet className="h-4 w-4 ml-1" />تصدير Excel
              </Button>
            )}
            {primaryAction && (
              <Button type="button" size="sm" disabled={primaryAction.disabled} onClick={primaryAction.onClick}>
                <Plus className="h-4 w-4 ml-1" />{primaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
