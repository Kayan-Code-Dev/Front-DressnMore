import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface StatementFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  branchId: string;
  onBranchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  branches: { id: number; name: string }[];
  categories: string[];
}

export function StatementFiltersBar({
  search,
  onSearchChange,
  type,
  onTypeChange,
  branchId,
  onBranchChange,
  category,
  onCategoryChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  branches,
  categories,
}: StatementFiltersBarProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm" style={{ borderColor: "var(--color-border)" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <div className="space-y-1.5 min-w-0 xl:col-span-1">
          <Label className="text-xs text-muted-foreground">بحث</Label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="رقم مرجعي، بيان، طرف..."
              className="pr-9"
            />
          </div>
        </div>
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground">النوع</Label>
          <Select value={type || "all"} onValueChange={(v) => onTypeChange(v === "all" ? "" : v)}>
            <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="in">دخل</SelectItem>
              <SelectItem value="out">خروج</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground">الفرع</Label>
          <Select value={branchId || "all"} onValueChange={(v) => onBranchChange(v === "all" ? "" : v)}>
            <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {branches.map((b) => (
                <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground">الفئة</Label>
          <Select value={category || "all"} onValueChange={(v) => onCategoryChange(v === "all" ? "" : v)}>
            <SelectTrigger><SelectValue placeholder="الكل" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground">من تاريخ</Label>
          <Input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} dir="ltr" />
        </div>
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground">إلى تاريخ</Label>
          <Input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} dir="ltr" />
        </div>
      </div>
    </div>
  );
}
