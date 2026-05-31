import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { CashboxItem, CashboxTransaction } from "@/features/cashboxes/types/cashboxes.types";
import { getCashboxMock, listCashboxTransactionsMock } from "@/features/cashboxes/services/cashboxes.mock.service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, ArrowRight, ArrowLeftRight } from "lucide-react";
import { formatNumber } from "@/shared/lib/format/numbers";

function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-3 bg-muted/30 border" style={{ borderColor: "var(--color-border)" }}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="text-sm font-semibold mt-0.5">{children}</div>
    </div>
  );
}

function TableSkeletonRows({ rows = 4, cols = 6 }: { rows?: number; cols?: number }) {
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

export function CashboxDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const cashboxId = id ? Number(id) : 0;
  const [loading, setLoading] = useState(true);
  const [cashbox, setCashbox] = useState<CashboxItem | null>(null);
  const [transactions, setTransactions] = useState<CashboxTransaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getCashboxMock(cashboxId), listCashboxTransactionsMock(cashboxId)])
      .then(([cashboxRes, txRes]) => {
        if (cancelled) return;
        setCashbox(cashboxRes.data);
        setTransactions(txRes.data.slice(0, 8));
        setError(cashboxRes.data ? null : "الصندوق غير موجود");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "فشل تحميل بيانات الصندوق");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [cashboxId]);

  const columns = useMemo(
    () => [
      { key: "date", title: "التاريخ" },
      { key: "type", title: "النوع" },
      { key: "reference", title: "المرجع" },
      { key: "description", title: "الوصف" },
      { key: "amount", title: "المبلغ" },
      { key: "balance", title: "الرصيد بعد" },
    ],
    []
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/cashboxes">
            <ArrowRight className="h-4 w-4 ml-1" />
            العودة للصناديق
          </Link>
        </Button>
        {cashbox && (
          <Button variant="outline" size="sm" asChild>
            <Link to={`/cashboxes/${cashbox.id}/transactions`}>
              <ArrowLeftRight className="h-4 w-4 ml-1" />
              سجل الحركات الكامل
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #D97706, #FBBF24)" }}
            >
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              {loading ? (
                <Skeleton className="h-6 w-40 mb-1" />
              ) : (
                <>
                  <CardTitle className="text-lg font-black">{cashbox?.name ?? "—"}</CardTitle>
                  <CardDescription>{cashbox?.branch_id ? `فرع #${cashbox.branch_id}` : "—"}</CardDescription>
                </>
              )}
            </div>
          </div>
          {!loading && cashbox && (
            <Badge variant={cashbox.is_active ? "success" : "destructive"}>
              {cashbox.is_active ? "نشط" : "غير نشط"}
            </Badge>
          )}
        </CardHeader>

        <CardContent>
          {error && <p className="text-destructive text-sm text-center py-6">{error}</p>}

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          )}

          {!loading && cashbox && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="border-amber-200/60 bg-amber-50/30 dark:bg-amber-950/20">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-1">الرصيد الحالي</p>
                    <p className="text-2xl font-black text-amber-700 dark:text-amber-400">
                      {formatNumber(cashbox.current_balance)} ج.م
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-1">الرصيد الافتتاحي</p>
                    <p className="text-2xl font-bold">{formatNumber(cashbox.initial_balance)} ج.م</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-1">صافي التغيير</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {formatNumber((cashbox.current_balance - cashbox.initial_balance))} ج.م
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <DetailField label="الفرع">{cashbox.branch_id ? `#${cashbox.branch_id}` : "—"}</DetailField>
                <DetailField label="الوصف">{cashbox.description || "—"}</DetailField>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold">آخر الحركات</CardTitle>
          <CardDescription>أحدث معاملات الصندوق النقدي.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  {columns.map((col) => (
                    <TableHead key={col.key} className="text-center font-bold text-xs">
                      {col.title}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableSkeletonRows cols={columns.length} />
                ) : transactions.length > 0 ? (
                  transactions.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-center text-muted-foreground">{row.date}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={row.type === "in" ? "success" : "destructive"}>
                          {row.type === "in" ? "وارد" : "صادر"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-xs text-muted-foreground">{row.reference}</TableCell>
                      <TableCell className="text-center text-xs max-w-[180px] truncate">{row.description}</TableCell>
                      <TableCell className="text-center font-medium">
                        {row.type === "in" ? "+" : "-"}
                        {formatNumber(row.amount)}
                      </TableCell>
                      <TableCell className="text-center font-bold">{formatNumber(row.balance_after)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">
                      لا توجد حركات لعرضها.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
