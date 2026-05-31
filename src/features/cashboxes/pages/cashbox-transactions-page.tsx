import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import type { CashboxTransaction } from "@/features/cashboxes/types/cashboxes.types";
import { getCashboxMock, listCashboxTransactionsMock } from "@/features/cashboxes/services/cashboxes.mock.service";
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
import { Label } from "@/components/ui/label";
import { Wallet, Search, Filter, ArrowRight, Lock } from "lucide-react";

function TableSkeletonRows({ rows = 5, cols = 7 }: { rows?: number; cols?: number }) {
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

export function CashboxTransactionsPage() {
  const { id } = useParams<{ id: string }>();
  const cashboxId = id ? Number(id) : 0;
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<CashboxTransaction[]>([]);
  const [cashboxName, setCashboxName] = useState("");

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
  };

  useEffect(() => {
    getCashboxMock(cashboxId).then((res) => {
      if (res.data) setCashboxName(res.data.name);
    });
  }, [cashboxId]);

  useEffect(() => {
    let cancelled = false;
    listCashboxTransactionsMock(cashboxId || undefined, search)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [cashboxId, search]);

  const stats = useMemo(() => {
    const incoming = rows.filter((r) => r.type === "in").reduce((s, r) => s + r.amount, 0);
    const outgoing = rows.filter((r) => r.type === "out").reduce((s, r) => s + r.amount, 0);
    return { incoming, outgoing, net: incoming - outgoing, count: rows.length };
  }, [rows]);

  const columns = useMemo(
    () => [
      { key: "date", title: "التاريخ" },
      { key: "type", title: "النوع" },
      { key: "reference", title: "المرجع" },
      { key: "description", title: "الوصف" },
      { key: "amount", title: "المبلغ" },
      { key: "balance", title: "الرصيد بعد" },
      { key: "by", title: "بواسطة" },
    ],
    []
  );

  return (
    <div className="w-full space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to={cashboxId ? `/cashboxes/${cashboxId}` : "/cashboxes"}>
          <ArrowRight className="h-4 w-4 ml-1" />
          العودة للصندوق
        </Link>
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #D97706, #FBBF24)" }}
            >
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black">سجل حركات الصندوق</CardTitle>
              <CardDescription>
                {cashboxName ? `صندوق: ${cashboxName}` : "عرض جميع الحركات النقدية مع الإحصائيات."}
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}>
            <Filter className="h-4 w-4 ml-1.5" />
            الفلاتر
          </Button>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">إجمالي الوارد</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.incoming.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">إجمالي الصادر</p>
            <p className="text-2xl font-bold text-red-600">{stats.outgoing.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">صافي الحركة</p>
            <p className="text-2xl font-bold">{stats.net.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">عدد الحركات</p>
            <p className="text-2xl font-bold">{stats.count}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="بحث في الحركات..."
                  className="pr-9"
                />
              </div>
            </div>
            <ListPageStandardFilters open={filtersOpen} />

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
                  ) : rows.length > 0 ? (
                    rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-center text-muted-foreground">{row.date}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={row.type === "in" ? "success" : "destructive"}>
                            {row.type === "in" ? "وارد" : "صادر"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-xs text-muted-foreground">{row.reference}</TableCell>
                        <TableCell className="text-center text-xs max-w-[160px] truncate">{row.description}</TableCell>
                        <TableCell className="text-center font-medium">{row.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-center font-bold">{row.balance_after.toLocaleString()}</TableCell>
                        <TableCell className="text-center text-muted-foreground text-xs">{row.created_by}</TableCell>
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
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              إجمالي السجلات: <span className="font-bold">{rows.length}</span>
            </p>
          </CardFooter>
        </Card>

        <Card className="border-blue-200/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-base font-bold">إغلاق يومي</CardTitle>
            </div>
            <CardDescription>واجهة إغلاق نهاية اليوم — للعرض فقط.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="close-date">تاريخ الإغلاق</Label>
              <Input id="close-date" type="date" defaultValue="2026-05-30" />
            </div>
            <div className="space-y-2">
              <Label>رصيد النظام</Label>
              <p className="text-xl font-bold text-amber-700">24,300 ج.م</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="actual-balance">الرصيد الفعلي</Label>
              <Input id="actual-balance" type="number" placeholder="أدخل الرصيد الفعلي" />
            </div>
            <div className="rounded-lg border p-3 bg-muted/20 text-sm" style={{ borderColor: "var(--color-border)" }}>
              <p className="text-muted-foreground mb-1">الفرق المتوقع</p>
              <p className="font-bold text-emerald-600">0 ج.م</p>
            </div>
            <Button className="w-full" disabled>
              <Lock className="h-4 w-4 ml-1.5" />
              تنفيذ الإغلاق (قريباً)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
