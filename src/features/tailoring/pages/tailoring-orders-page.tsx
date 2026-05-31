import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import {
  getTailoringStatsMock,
  listTailoringOrdersMock,
} from "@/features/tailoring/services/tailoring.mock.service";
import type { TailoringOrder, TailoringOrderStats, TailoringOrderStatus } from "@/features/tailoring/types/tailoring.types";
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
  Scissors,
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

const statusMap: Record<TailoringOrderStatus, { label: string; variant: "success" | "warning" | "destructive" | "info" }> = {
  active: { label: "نشط", variant: "success" },
  completed: { label: "منجز", variant: "info" },
  overdue: { label: "متأخر", variant: "destructive" },
  cancelled: { label: "ملغي", variant: "warning" },
};

const stageLabels: Record<string, string> = {
  measurements: "القياسات",
  cutting: "القص",
  sewing: "الخياطة",
  finishing: "التشطيب",
  ready_for_delivery: "جاهز للتسليم",
};

const priorityLabels: Record<string, { label: string; variant: "info" | "destructive" | "secondary" }> = {
  VIP: { label: "VIP", variant: "info" },
  urgent: { label: "عاجل", variant: "destructive" },
  normal: { label: "عادي", variant: "secondary" },
};

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  gradient,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-xl font-black" style={{ color: "var(--color-text-primary)" }}>{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: gradient }}>
            <Icon className="w-4 h-4 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TableSkeletonRows({ rows = 5, cols = 9 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((__, j) => (
            <TableCell key={j} className="text-center"><Skeleton className="h-5 w-full max-w-[90px] mx-auto" /></TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function TailoringOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<TailoringOrder[]>([]);
  const [stats, setStats] = useState<TailoringOrderStats | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getTailoringStatsMock()
      .then((res) => setStats(res.data))
      .finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listTailoringOrdersMock(search, page)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const meta = response.meta as { last_page?: number; total?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setTotal(meta?.total ?? response.data.length);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [search, page]);

  const columns = useMemo(
    () => [
      { key: "id", title: "#" },
      { key: "client", title: "العميل" },
      { key: "fabric", title: "القماش" },
      { key: "due_date", title: "موعد التسليم" },
      { key: "stage", title: "المرحلة" },
      { key: "priority", title: "الأولوية" },
      { key: "total", title: "الإجمالي" },
      { key: "status", title: "الحالة" },
      { key: "actions", title: "إجراءات" },
    ],
    [],
  );

  return (
    <div className="w-full space-y-4" dir="rtl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="pt-5"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))
        ) : stats ? (
          <>
            <StatCard label="إجمالي الأوامر" value={stats.total} sub={`${stats.active} نشطة`} icon={Scissors} gradient="linear-gradient(135deg, #BE185D, #F472B6)" />
            <StatCard label="أوامر نشطة" value={stats.active} sub="قيد التنفيذ" icon={Clock} gradient="linear-gradient(135deg, #059669, #34D399)" />
            <StatCard label="متأخر" value={stats.overdue} sub="تحتاج متابعة" icon={AlertTriangle} gradient="linear-gradient(135deg, #DC2626, #F87171)" />
            <StatCard label="جاهز للتسليم" value={stats.ready} sub={`${stats.revenue} ج.م إيرادات`} icon={CheckCircle} gradient="linear-gradient(135deg, #7C3AED, #A78BFA)" />
          </>
        ) : null}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #BE185D, #F472B6)" }}>
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>أوامر التفصيل</CardTitle>
              <CardDescription>إدارة ومتابعة أوامر التفصيل والقياسات.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}><Filter className="h-4 w-4 ml-1.5" />الفلاتر</Button>
            <Button disabled><Plus className="h-4 w-4 ml-1.5" />أمر تفصيل جديد</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-sm mb-4">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => { setLoading(true); setSearch(e.target.value); setPage(1); }} placeholder="بحث برقم الأمر أو اسم العميل..." className="pr-9" />
          </div>
          <ListPageStandardFilters open={filtersOpen} />

          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  {columns.map((col) => (<TableHead key={col.key} className="text-center font-bold text-xs">{col.title}</TableHead>))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableSkeletonRows rows={5} cols={columns.length} />
                ) : rows.length > 0 ? (
                  rows.map((row) => {
                    const statusCfg = statusMap[row.status];
                    const priorityCfg = priorityLabels[row.priority];
                    return (
                      <TableRow key={row.id}>
                        <TableCell className="text-center"><Badge variant="outline" className="font-mono">{row.id}</Badge></TableCell>
                        <TableCell className="text-center">
                          <div className="font-medium">{row.client_name}</div>
                          <div className="text-xs text-muted-foreground" dir="ltr">{row.client_phone}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div>{row.fabric_name}</div>
                          <Badge variant="outline" className="font-mono text-xs mt-0.5">{row.fabric_code}</Badge>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground text-xs">{row.due_date}</TableCell>
                        <TableCell className="text-center text-sm">{stageLabels[row.current_stage] ?? row.current_stage}</TableCell>
                        <TableCell className="text-center"><Badge variant={priorityCfg.variant}>{priorityCfg.label}</Badge></TableCell>
                        <TableCell className="text-center font-medium">{row.total_price} ج.م</TableCell>
                        <TableCell className="text-center"><Badge variant={statusCfg.variant}>{statusCfg.label}</Badge></TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="icon" asChild title="عرض">
                            <Link to={`/tailoring/orders/${row.id}`}><Eye className="h-4 w-4" /></Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">لا توجد أوامر تفصيل.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">إجمالي الأوامر: <span className="font-bold">{total}</span></p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => { setLoading(true); setPage(page - 1); }}><ChevronRight className="h-4 w-4" /> السابق</Button>
              <span className="text-sm text-muted-foreground px-2">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => { setLoading(true); setPage(page + 1); }}>التالي <ChevronLeft className="h-4 w-4" /></Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
