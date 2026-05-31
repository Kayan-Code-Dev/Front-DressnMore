import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { isModuleLive } from "@/config/feature-flags";
import {
  getTailoringStatsMock,
  listTailoringOrdersMock,
} from "@/features/tailoring/services/tailoring.mock.service";
import {
  getTailoringStats,
  listTailoringOrders,
} from "@/features/tailoring/services/tailoring.api.service";
import type {
  TailoringFilterParams,
  TailoringOrder,
  TailoringOrderStats,
  TailoringOrderStatus,
} from "@/features/tailoring/types/tailoring.types";
import { getReadyOrders, getUrgentOrders } from "@/features/tailoring/mocks/tailoring.mock";
import { TailoringStatsSection } from "@/features/tailoring/components/tailoring-stats-section";
import { TailoringFiltersBar } from "@/features/tailoring/components/tailoring-filters-bar";
import { TailoringKanbanBoard } from "@/features/tailoring/components/tailoring-kanban-board";
import { priorityMap, statusMap } from "@/features/tailoring/constants/tailoring.constants";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/shared/lib/format/numbers";
import {
  Scissors,
  Plus,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function TailoringOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TailoringFilterParams>({ status: "all", priority: "all", stage: "all" });
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [rows, setRows] = useState<TailoringOrder[]>([]);
  const [stats, setStats] = useState<TailoringOrderStats | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = isModuleLive("tailoring") ? getTailoringStats : () => getTailoringStatsMock().then((r) => r.data);
    loadStats()
      .then(setStats)
      .catch((e: Error) => setError(e.message))
      .finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = {
      search,
      page: viewMode === "kanban" ? 1 : page,
      per_page: viewMode === "kanban" ? 100 : 15,
      status: filters.status !== "all" ? filters.status : undefined,
      stage: filters.stage !== "all" ? filters.stage : undefined,
      priority: filters.priority !== "all" ? filters.priority : undefined,
    };

    const loadOrders = isModuleLive("tailoring")
      ? () => listTailoringOrders(params)
      : () => listTailoringOrdersMock(params);

    loadOrders()
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const meta = response.meta as { last_page?: number; total?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setTotal(meta?.total ?? response.data.length);
      })
      .catch((e: Error) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [search, page, filters, viewMode]);

  const urgentOrders = useMemo(() => getUrgentOrders(rows), [rows]);
  const readyOrders = useMemo(
    () =>
      getReadyOrders(rows).map((o) => ({
        id: o.id,
        client_name: o.client_name,
        garment_name: o.garment_name,
        total_price: o.total_price,
        whatsapp: o.customer?.whatsapp,
      })),
    [rows],
  );

  return (
    <div className="w-full space-y-5" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #BE185D, #F472B6)", boxShadow: "0 4px 14px rgba(190,24,93,0.25)" }}
          >
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black" style={{ color: "var(--color-text-primary)" }}>قسم التفصيل</h1>
            <p className="text-sm text-muted-foreground">إدارة أوامر التفصيل — القياسات — الأقمشة — مراحل الإنتاج</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" asChild>
            <Link to="/reports/tailoring"><FileText className="h-4 w-4 ml-1.5" />تقرير التفصيل</Link>
          </Button>
          <Button disabled style={{ background: "linear-gradient(135deg, #1E293B, #334155)" }} className="text-white border-0">
            <Plus className="h-4 w-4 ml-1.5" />أمر تفصيل جديد
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <TailoringStatsSection
        stats={stats}
        loading={statsLoading}
        urgentOrders={urgentOrders}
        readyOrders={readyOrders}
      />

      <TailoringFiltersBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        filters={filters}
        onFiltersChange={(f) => { setFilters(f); setPage(1); }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        resultCount={total}
      />

      {viewMode === "kanban" ? (
        loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-[280px] h-64 shrink-0 rounded-xl" />
            ))}
          </div>
        ) : (
          <TailoringKanbanBoard orders={rows} />
        )
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--color-border)" }}>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    {["#", "العميل", "الثوب", "المرحلة", "الأولوية", "موعد التسليم", "الإجمالي", "الحالة", ""].map((h) => (
                      <TableHead key={h} className="text-center font-bold text-xs">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 9 }).map((__, j) => (
                          <TableCell key={j}><Skeleton className="h-5 w-full max-w-[80px] mx-auto" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : rows.length === 0 ? (
                    <TableRow><TableCell colSpan={9} className="py-12 text-center text-muted-foreground">لا توجد أوامر</TableCell></TableRow>
                  ) : (
                    rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-center"><Badge variant="outline" className="font-mono text-blue-600">{row.order_number}</Badge></TableCell>
                        <TableCell className="text-center">
                          <div className="font-medium">{row.client_name}</div>
                          <div className="text-xs text-muted-foreground" dir="ltr">{row.client_phone}</div>
                        </TableCell>
                        <TableCell className="text-center text-sm">{row.garment_name}</TableCell>
                        <TableCell className="text-center text-xs">{row.current_stage}</TableCell>
                        <TableCell className="text-center"><Badge variant={priorityMap[row.priority].variant}>{priorityMap[row.priority].label}</Badge></TableCell>
                        <TableCell className="text-center text-xs text-muted-foreground">{row.due_date}</TableCell>
                        <TableCell className="text-center font-bold">{formatNumber(row.total_price)} ج.م</TableCell>
                        <TableCell className="text-center"><Badge variant={statusMap[row.status as TailoringOrderStatus].variant}>{statusMap[row.status as TailoringOrderStatus].label}</Badge></TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="icon" asChild><Link to={`/tailoring/orders/${row.id}`}><Eye className="h-4 w-4" /></Link></Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          {totalPages > 1 && (
            <CardFooter className="flex items-center justify-between flex-wrap gap-3 pt-4">
              <p className="text-sm text-muted-foreground">إجمالي: <span className="font-bold">{total}</span></p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronRight className="h-4 w-4" /> السابق</Button>
                <span className="text-sm text-muted-foreground px-2">{page} / {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>التالي <ChevronLeft className="h-4 w-4" /></Button>
              </div>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
}
