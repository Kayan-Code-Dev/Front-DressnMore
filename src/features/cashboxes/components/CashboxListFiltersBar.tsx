import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface CashboxListFiltersBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  branchId: string;
  onBranchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  perPage: string;
  onPerPageChange: (value: string) => void;
  branches: { id: number; name: string }[];
}

export function CashboxListFiltersBar({
  search,
  onSearchChange,
  branchId,
  onBranchChange,
  status,
  onStatusChange,
  perPage,
  onPerPageChange,
  branches,
}: CashboxListFiltersBarProps) {
  return (
    <div
      className="rounded-xl border bg-white p-4 shadow-sm overflow-x-hidden"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground">بحث</Label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="بحث باسم الخزنة أو الفرع..."
              className="pr-9"
            />
          </div>
        </div>

        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground">الفرع</Label>
          <Select value={branchId || "all"} onValueChange={(v) => onBranchChange(v === "all" ? "" : v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="الكل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={String(branch.id)}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground">الحالة</Label>
          <Select value={status || "all"} onValueChange={(v) => onStatusChange(v === "all" ? "" : v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="كل الحالات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="inactive">غير نشط</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground">عدد العرض</Label>
          <Select value={perPage} onValueChange={onPerPageChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 خزنة</SelectItem>
              <SelectItem value="10">10 خزنة</SelectItem>
              <SelectItem value="15">15 خزنة</SelectItem>
              <SelectItem value="25">25 خزنة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
