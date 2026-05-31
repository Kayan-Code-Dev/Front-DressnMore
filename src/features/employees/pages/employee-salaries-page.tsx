import { useEffect, useMemo, useState } from "react";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import type { EmployeeSalaryItem, SalaryStats } from "@/features/employees/types/employees.types";
import { listEmployeeSalariesMock } from "@/features/employees/services/employees.mock.service";
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
import { Banknote, Search, Filter, Wallet, CheckCircle, Clock } from "lucide-react";

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

export function EmployeeSalariesPage() {
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<EmployeeSalaryItem[]>([]);
  const [stats, setStats] = useState<SalaryStats>({
    total_employees: 0,
    paid_count: 0,
    unpaid_count: 0,
    total_net: 0,
  });

  useEffect(() => {
    let cancelled = false;
    listEmployeeSalariesMock(search)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const metaStats = response.meta?.stats as SalaryStats | undefined;
        if (metaStats) setStats(metaStats);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load salaries");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [search]);

  const columns = useMemo(
    () => [
      { key: "employee_name", title: "الموظف" },
      { key: "branch_name", title: "الفرع" },
      { key: "period", title: "الفترة" },
      { key: "base_salary", title: "الأساسي" },
      { key: "allowances", title: "البدلات" },
      { key: "deductions", title: "الخصومات" },
      { key: "net_salary", title: "الصافي" },
      { key: "status", title: "الحالة" },
    ],
    []
  );

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border p-4 flex items-center gap-3" style={{ borderColor: "var(--color-border)" }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3B82F6, #60A5FA)" }}>
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">إجمالي الموظفين</p>
            <p className="text-lg font-black">{stats.total_employees}</p>
          </div>
        </div>
        <div className="rounded-xl border p-4 flex items-center gap-3" style={{ borderColor: "var(--color-border)" }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #10B981, #34D399)" }}>
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">تم الصرف</p>
            <p className="text-lg font-black">{stats.paid_count}</p>
          </div>
        </div>
        <div className="rounded-xl border p-4 flex items-center gap-3" style={{ borderColor: "var(--color-border)" }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F59E0B, #FBBF24)" }}>
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">لم يُصرف</p>
            <p className="text-lg font-black">{stats.unpaid_count}</p>
          </div>
        </div>
        <div className="rounded-xl border p-4 flex items-center gap-3" style={{ borderColor: "var(--color-border)" }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA)" }}>
            <Banknote className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">إجمالي الصافي</p>
            <p className="text-lg font-black">{stats.total_net.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #3B82F6, #60A5FA)" }}
            >
              <Banknote className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black">الرواتب</CardTitle>
              <CardDescription>عرض وإدارة رواتب الموظفين.</CardDescription>
            </div>
          </div>
          <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}>
            <Filter className="h-4 w-4 ml-1.5" />
            الفلاتر
          </Button>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => { setLoading(true); setSearch(e.target.value); }}
                placeholder="بحث عن موظف..."
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
                    rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-center font-medium">{row.employee_name}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.branch_name}</TableCell>
                        <TableCell className="text-center">{row.period}</TableCell>
                        <TableCell className="text-center">{row.base_salary.toLocaleString()}</TableCell>
                        <TableCell className="text-center text-emerald-600">+{row.allowances.toLocaleString()}</TableCell>
                        <TableCell className="text-center text-red-500">-{row.deductions.toLocaleString()}</TableCell>
                        <TableCell className="text-center font-bold">{row.net_salary.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={row.status === "paid" ? "success" : "outline"}>
                            {row.status === "paid" ? "تم الصرف" : "لم يُصرف"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">
                        لا توجد بيانات رواتب.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <p className="text-sm text-muted-foreground">
            الفترة: <span className="font-bold">2025-05</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
