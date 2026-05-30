import { useEffect, useMemo, useState } from "react";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import { isModuleLive } from "@/config/feature-flags";
import type { SupplierItem } from "@/features/suppliers/types/suppliers.types";
import { listSuppliersMock } from "@/features/suppliers/services/suppliers.mock.service";
import { listSuppliers } from "@/features/suppliers/services/suppliers.api.service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog as ShadDialog,
  DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Truck, Search, Plus, Filter, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

function fetchSupplierData(searchTerm: string, currentPage: number) {
  if (isModuleLive("suppliers")) {
    return listSuppliers({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listSuppliersMock(searchTerm);
}

function TableSkeletonRows({ rows = 5, cols = 7 }: { rows?: number; cols?: number }) {
  return (<>{Array.from({ length: rows }).map((_, i) => (<TableRow key={i}>{Array.from({ length: cols }).map((__, j) => (<TableCell key={j} className="text-center"><Skeleton className="h-5 w-full max-w-[100px] mx-auto" /></TableCell>))}</TableRow>))}</>);
}

export function SuppliersPage() {
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<SupplierItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [dialog, setDialog] = useState<"create" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<SupplierItem | null>(null);

  const handleSearchChange = (value: string) => { setLoading(true); setSearch(value); setPage(1); };
  const handlePageChange = (nextPage: number) => { setLoading(true); setPage(nextPage); };

  useEffect(() => {
    let cancelled = false;
    fetchSupplierData(search, page)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const meta = response.meta as { last_page?: number; total?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setTotal(meta?.total ?? response.data.length);
        setError(null);
      })
      .catch((err: unknown) => { if (cancelled) return; setError(err instanceof Error ? err.message : "Failed to load suppliers"); setRows([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [search, page]);

  const columns = useMemo(() => [
    { key: "id", title: "#" },
    { key: "code", title: "الكود" },
    { key: "name", title: "الاسم" },
    { key: "phone", title: "الهاتف" },
    { key: "address", title: "العنوان" },
    { key: "current_balance", title: "الرصيد" },
    { key: "status", title: "الحالة" },
    { key: "actions", title: "إجراءات" },
  ], []);

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA)" }}>
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>إدارة الموردين</CardTitle>
              <CardDescription>عرض وإدارة بيانات الموردين.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}><Filter className="h-4 w-4 ml-1.5" />الفلاتر</Button>
            <Button onClick={() => { setSelected(null); setDialog("create"); }}><Plus className="h-4 w-4 ml-1.5" />إنشاء مورد</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input value={search} onChange={(e) => handleSearchChange(e.target.value)} placeholder="بحث عن مورد..." className="pr-9" />
            </div>
          </div>
          <ListPageStandardFilters open={filtersOpen} />

          {error && <div className="flex items-center justify-center py-6"><p className="text-destructive text-sm">حدث خطأ أثناء تحميل البيانات: {error}</p></div>}
          {!error && (
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
              <Table>
                <TableHeader><TableRow className="bg-muted/30">{columns.map((col) => (<TableHead key={col.key} className="text-center font-bold text-xs">{col.title}</TableHead>))}</TableRow></TableHeader>
                <TableBody>
                  {loading ? (<TableSkeletonRows rows={5} cols={columns.length} />) : rows.length > 0 ? (
                    rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-center text-muted-foreground">{row.id}</TableCell>
                        <TableCell className="text-center"><Badge variant="outline" className="font-mono">{row.code}</Badge></TableCell>
                        <TableCell className="text-center font-medium">{row.name}</TableCell>
                        <TableCell className="text-center text-muted-foreground" dir="ltr">{row.phone}</TableCell>
                        <TableCell className="text-center text-muted-foreground text-xs max-w-[150px] truncate">{row.address || "—"}</TableCell>
                        <TableCell className="text-center font-medium">{row.current_balance.toLocaleString()}</TableCell>
                        <TableCell className="text-center"><Badge variant={row.status === "active" ? "success" : "destructive"}>{row.status === "active" ? "نشط" : "غير نشط"}</Badge></TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelected(row); setDialog("edit"); }}><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelected(row); setDialog("delete"); }}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">لا يوجد موردين لعرضهم.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">إجمالي الموردين: <span className="font-bold">{total}</span></p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => handlePageChange(page - 1)}><ChevronRight className="h-4 w-4" />السابق</Button>
              <span className="text-sm text-muted-foreground px-2">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}>التالي<ChevronLeft className="h-4 w-4" /></Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <ShadDialog open={dialog !== null} onOpenChange={() => setDialog(null)}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>{dialog === "create" ? "إنشاء مورد جديد" : dialog === "edit" ? "تعديل المورد" : "حذف المورد"}</DialogTitle>
            <DialogDescription>
              {dialog === "create" ? "أدخل بيانات المورد الجديد." : dialog === "edit" ? `تعديل بيانات المورد: ${selected?.name ?? ""}` : `هل أنت متأكد أنك تريد حذف المورد "${selected?.name ?? ""}"؟`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-sm text-muted-foreground">سيتم تفعيل هذه الميزة قريباً.</div>
          <DialogFooter><Button variant="outline" onClick={() => setDialog(null)}>إغلاق</Button></DialogFooter>
        </DialogContent>
      </ShadDialog>
    </div>
  );
}
