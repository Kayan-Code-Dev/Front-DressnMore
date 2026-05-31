import { useEffect, useMemo, useState } from "react";
import { isModuleLive } from "@/config/feature-flags";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import type { EmployeeCustodyItem } from "@/features/employees/types/employees.types";
import { listEmployeeCustodies } from "@/features/employees/services/employees.api.service";
import { listEmployeeCustodiesMock } from "@/features/employees/services/employees.mock.service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Shield, Search, Plus, Filter, Pencil, Trash2 } from "lucide-react";
import { formatNumber } from "@/shared/lib/format/numbers";

const statusMap: Record<string, { label: string; variant: "success" | "destructive" | "outline" }> = {
  active: { label: "نشطة", variant: "success" },
  expiring_soon: { label: "تنتهي قريباً", variant: "outline" },
  expired: { label: "منتهية", variant: "destructive" },
  returned: { label: "مُعادة", variant: "outline" },
  damaged: { label: "تالف", variant: "destructive" },
  lost: { label: "مفقود", variant: "destructive" },
};

const typeLabels: Record<string, string> = {
  laptop: "لابتوب",
  guarantee: "ضمان مالي",
  equipment: "معدات",
  uniform: "زي موحد",
};

function TableSkeletonRows({ rows = 5, cols = 8 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((__, j) => (
            <TableCell key={j} className="text-center">
              <Skeleton className="h-5 w-full max-w-[100px] mx-auto" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function EmployeeCustodiesPage() {
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<EmployeeCustodyItem[]>([]);
  const [dialog, setDialog] = useState<null | "create" | "edit" | "delete">(null);

  useEffect(() => {
    let cancelled = false;
    const load = isModuleLive("employees")
      ? () => listEmployeeCustodies({ search, per_page: 100 })
      : () => listEmployeeCustodiesMock(search);

    load()
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load custodies");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [search]);

  const stats = useMemo(() => ({
    total: rows.length,
    active: rows.filter((c) => c.status === "active").length,
    expiring: rows.filter((c) => c.status === "expiring_soon").length,
    totalValue: rows.filter((c) => c.status === "active" || c.status === "expiring_soon")
      .reduce((s, c) => s + c.value, 0),
  }), [rows]);

  const columns = useMemo(
    () => [
      { key: "id", title: "#" },
      { key: "employee_name", title: "الموظف" },
      { key: "type", title: "النوع" },
      { key: "description", title: "الوصف" },
      { key: "value", title: "القيمة" },
      { key: "issued_at", title: "تاريخ الإصدار" },
      { key: "status", title: "الحالة" },
      { key: "actions", title: "إجراءات" },
    ],
    []
  );

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "إجمالي العهد", value: stats.total },
          { label: "نشطة", value: stats.active },
          { label: "تنتهي قريباً", value: stats.expiring },
          { label: "قيمة العهد النشطة", value: stats.totalValue, isMoney: true },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border p-4" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-lg font-black">{"isMoney" in s && s.isMoney ? formatNumber(Number(s.value)) : s.value}</p>
          </div>
        ))}
      </div>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black">العهد والضمانات</CardTitle>
              <CardDescription>إدارة عهد وضمانات الموظفين.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}>
              <Filter className="h-4 w-4 ml-1.5" />
              الفلاتر
            </Button>
            <Button onClick={() => setDialog("create")}>
              <Plus className="h-4 w-4 ml-1.5" />
              إضافة عهدة
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => { setLoading(true); setSearch(e.target.value); }}
                placeholder="بحث..."
                className="pr-9"
              />
            </div>
          </div>

          <ListPageStandardFilters open={filtersOpen} />

          {error && (
            <div className="flex items-center justify-center py-6">
              <p className="text-destructive text-sm">حدث خطأ: {error}</p>
            </div>
          )}

          {!error && (
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    {columns.map((col) => (
                      <TableHead key={col.key} className="text-center font-bold text-xs">{col.title}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableSkeletonRows rows={4} cols={columns.length} />
                  ) : rows.length > 0 ? (
                    rows.map((row) => {
                      const st = statusMap[row.status] ?? { label: row.status, variant: "outline" as const };
                      return (
                        <TableRow key={row.id}>
                          <TableCell className="text-center text-muted-foreground">{row.id}</TableCell>
                          <TableCell className="text-center font-medium">{row.employee_name}</TableCell>
                          <TableCell className="text-center">{typeLabels[row.type] ?? row.type}</TableCell>
                          <TableCell className="text-center text-muted-foreground text-xs max-w-[150px] truncate">{row.description}</TableCell>
                          <TableCell className="text-center font-medium">{formatNumber(row.value)}</TableCell>
                          <TableCell className="text-center text-muted-foreground">{row.issued_at}</TableCell>
                          <TableCell className="text-center"><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 justify-center">
                              <Button variant="ghost" size="icon" onClick={() => setDialog("edit")}><Pencil className="h-4 w-4" /></Button>
                              <Button variant="destructive" size="icon" onClick={() => setDialog("delete")}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">
                        لا توجد عهد لعرضها.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <p className="text-sm text-muted-foreground">إجمالي العهد: <span className="font-bold">{stats.total}</span></p>
        </CardFooter>
      </Card>

      <Dialog open={dialog !== null} onOpenChange={() => setDialog(null)}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {dialog === "create" ? "إضافة عهدة" : dialog === "edit" ? "تعديل العهدة" : "حذف العهدة"}
            </DialogTitle>
            <DialogDescription>سيتم تفعيل هذه الميزة قريباً.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
