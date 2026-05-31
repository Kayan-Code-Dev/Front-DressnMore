import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { InventoryTransferItem } from "@/features/inventory/types/inventory.types";
import { listInventoryTransfersMock } from "@/features/inventory/services/inventory.mock.service";
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
import { ArrowLeftRight, Search, Plus, Check, X, ArrowRight } from "lucide-react";

const statusMap: Record<string, { label: string; variant: "success" | "destructive" | "outline" }> = {
  pending: { label: "قيد الانتظار", variant: "outline" },
  accepted: { label: "تم القبول", variant: "success" },
  rejected: { label: "مرفوض", variant: "destructive" },
  arrived: { label: "تم الوصول", variant: "success" },
};

function TableSkeletonRows({ rows = 3, cols = 7 }: { rows?: number; cols?: number }) {
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

export function TransferOperationsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<InventoryTransferItem[]>([]);
  const [dialog, setDialog] = useState<null | "create" | "approve" | "reject">(null);
  const [selected, setSelected] = useState<InventoryTransferItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    listInventoryTransfersMock(search)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load transfers");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [search]);

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
              style={{ background: "linear-gradient(135deg, #3B82F6, #60A5FA)" }}
            >
              <ArrowLeftRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black">عمليات التحويل</CardTitle>
              <CardDescription>إدارة طلبات تحويل المخزون بين الفروع.</CardDescription>
            </div>
          </div>
          <Button onClick={() => setDialog("create")}>
            <Plus className="h-4 w-4 ml-1.5" />
            طلب تحويل جديد
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
                    <TableHead className="text-center">من</TableHead>
                    <TableHead className="text-center">إلى</TableHead>
                    <TableHead className="text-center">الصنف</TableHead>
                    <TableHead className="text-center">الكمية</TableHead>
                    <TableHead className="text-center">الحالة</TableHead>
                    <TableHead className="text-center">التاريخ</TableHead>
                    <TableHead className="text-center">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableSkeletonRows cols={7} />
                  ) : rows.length > 0 ? (
                    rows.map((row) => {
                      const st = statusMap[row.status] ?? { label: row.status, variant: "outline" as const };
                      return (
                        <TableRow key={row.id}>
                          <TableCell className="text-center text-muted-foreground">{row.from_branch}</TableCell>
                          <TableCell className="text-center text-muted-foreground">{row.to_branch}</TableCell>
                          <TableCell className="text-center font-medium">{row.item_name}</TableCell>
                          <TableCell className="text-center font-bold">{row.quantity}</TableCell>
                          <TableCell className="text-center"><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                          <TableCell className="text-center text-muted-foreground">{row.created_at}</TableCell>
                          <TableCell>
                            {row.status === "pending" && (
                              <div className="flex justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="قبول"
                                  onClick={() => { setSelected(row); setDialog("approve"); }}
                                >
                                  <Check className="h-4 w-4 text-emerald-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="رفض"
                                  onClick={() => { setSelected(row); setDialog("reject"); }}
                                >
                                  <X className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">لا توجد عمليات تحويل.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <p className="text-sm text-muted-foreground">
            إجمالي العمليات: <span className="font-bold">{rows.length}</span>
          </p>
        </CardFooter>
      </Card>

      <Dialog open={dialog !== null} onOpenChange={() => setDialog(null)}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              {dialog === "create"
                ? "طلب تحويل جديد"
                : dialog === "approve"
                  ? "قبول التحويل"
                  : dialog === "reject"
                    ? "رفض التحويل"
                    : ""}
            </DialogTitle>
            <DialogDescription>
              {dialog === "create"
                ? "سيتم تفعيل إنشاء طلبات التحويل قريباً."
                : selected
                  ? `التحويل: ${selected.item_name} (${selected.quantity}) من ${selected.from_branch} إلى ${selected.to_branch}`
                  : "سيتم تفعيل هذه الميزة قريباً."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>إغلاق</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
