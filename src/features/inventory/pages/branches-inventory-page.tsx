import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { BranchInventoryItem } from "@/features/inventory/types/inventory.types";
import { listBranchInventoryMock } from "@/features/inventory/services/inventory.mock.service";
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
import { Building2, Search, Plus, Pencil, Trash2, ArrowRight } from "lucide-react";

const statusMap: Record<string, { label: string; variant: "success" | "destructive" | "outline" }> = {
  pending: { label: "قيد الانتظار", variant: "outline" },
  accepted: { label: "تم القبول", variant: "success" },
  rejected: { label: "مرفوض", variant: "destructive" },
  arrived: { label: "تم الوصول", variant: "success" },
};

function TableSkeletonRows({ rows = 4, cols = 7 }: { rows?: number; cols?: number }) {
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

export function BranchesInventoryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<BranchInventoryItem[]>([]);
  const [dialog, setDialog] = useState<null | "create" | "edit" | "delete">(null);

  useEffect(() => {
    let cancelled = false;
    listBranchInventoryMock(search)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load inventory");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [search]);

  const totalQuantity = useMemo(() => rows.reduce((s, r) => s + r.quantity, 0), [rows]);

  return (
    <div className="w-full space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/inventory">
          <ArrowRight className="h-4 w-4 ml-1" />
          العودة للمخزون
        </Link>
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #8B5CF6, #A78BFA)" }}
            >
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black">مخزون الفروع</CardTitle>
              <CardDescription>عرض وإدارة الأصناف في مخازن الفروع.</CardDescription>
            </div>
          </div>
          <Button onClick={() => setDialog("create")}>
            <Plus className="h-4 w-4 ml-1.5" />
            إضافة صنف
          </Button>
        </CardHeader>

        <CardContent>
          <div className="relative max-w-sm mb-4">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => { setLoading(true); setSearch(e.target.value); }}
              placeholder="بحث..."
              className="pr-9"
            />
          </div>

          {error && <p className="text-destructive text-sm text-center py-6">{error}</p>}

          {!error && (
            <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="text-center">الصنف</TableHead>
                    <TableHead className="text-center">القسم</TableHead>
                    <TableHead className="text-center">القسم الفرعي</TableHead>
                    <TableHead className="text-center">الفرع</TableHead>
                    <TableHead className="text-center">الكمية</TableHead>
                    <TableHead className="text-center">الحالة</TableHead>
                    <TableHead className="text-center">آخر تحديث</TableHead>
                    <TableHead className="text-center">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableSkeletonRows cols={8} />
                  ) : rows.length > 0 ? (
                    rows.map((row) => {
                      const st = statusMap[row.status] ?? { label: row.status, variant: "outline" as const };
                      return (
                        <TableRow key={row.id}>
                          <TableCell className="text-center font-medium">{row.item_name}</TableCell>
                          <TableCell className="text-center text-muted-foreground">{row.category}</TableCell>
                          <TableCell className="text-center text-muted-foreground">{row.subcategory}</TableCell>
                          <TableCell className="text-center">{row.branch_name}</TableCell>
                          <TableCell className="text-center font-bold">{row.quantity}</TableCell>
                          <TableCell className="text-center"><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                          <TableCell className="text-center text-muted-foreground">{row.updated_at}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-1">
                              <Button variant="ghost" size="icon" onClick={() => setDialog("edit")}><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => setDialog("delete")}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">لا توجد أصناف.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <p className="text-sm text-muted-foreground">
            إجمالي الأصناف: <span className="font-bold">{rows.length}</span>
            {" · "}
            إجمالي الكميات: <span className="font-bold">{totalQuantity}</span>
          </p>
        </CardFooter>
      </Card>

      <Dialog open={dialog !== null} onOpenChange={() => setDialog(null)}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {dialog === "create" ? "إضافة صنف" : dialog === "edit" ? "تعديل الصنف" : "حذف الصنف"}
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
