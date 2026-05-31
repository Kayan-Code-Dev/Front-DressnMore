import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import type { EmployeeItem, EmployeeStats } from "@/features/employees/types/employees.types";
import { listEmployeesMock } from "@/features/employees/services/employees.mock.service";
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
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  UserCheck,
  CalendarOff,
  Banknote,
} from "lucide-react";

const statusMap: Record<string, { label: string; variant: "success" | "destructive" | "outline" }> = {
  active: { label: "نشط", variant: "success" },
  on_leave: { label: "إجازة", variant: "outline" },
  suspended: { label: "موقوف", variant: "destructive" },
  terminated: { label: "منتهي", variant: "destructive" },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status] ?? { label: status, variant: "outline" as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

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

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="rounded-xl border p-4 flex items-center gap-3" style={{ borderColor: "var(--color-border)" }}>
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: color }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-black">{value}</p>
      </div>
    </div>
  );
}

export function EmployeesPage() {
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<EmployeeItem[]>([]);
  const [stats, setStats] = useState<EmployeeStats>({ total: 0, active: 0, on_leave: 0, salary_sum: 0 });

  useEffect(() => {
    let cancelled = false;
    listEmployeesMock(search)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
        const metaStats = response.meta?.stats as EmployeeStats | undefined;
        if (metaStats) setStats(metaStats);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load employees");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [search]);

  const columns = useMemo(
    () => [
      { key: "id", title: "#" },
      { key: "employee_code", title: "كود الموظف" },
      { key: "name", title: "الاسم" },
      { key: "job_title", title: "المسمى الوظيفي" },
      { key: "branch_name", title: "الفرع" },
      { key: "phone", title: "الهاتف" },
      { key: "base_salary", title: "الراتب" },
      { key: "status", title: "الحالة" },
      { key: "actions", title: "إجراءات" },
    ],
    []
  );

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="إجمالي الموظفين" value={stats.total} icon={Users} color="linear-gradient(135deg, #7C3AED, #A78BFA)" />
        <StatCard label="نشط" value={stats.active} icon={UserCheck} color="linear-gradient(135deg, #10B981, #34D399)" />
        <StatCard label="في إجازة" value={stats.on_leave} icon={CalendarOff} color="linear-gradient(135deg, #F59E0B, #FBBF24)" />
        <StatCard label="مجموع الرواتب" value={stats.salary_sum.toLocaleString()} icon={Banknote} color="linear-gradient(135deg, #3B82F6, #60A5FA)" />
      </div>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #10B981, #34D399)" }}
            >
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>
                الموظفون
              </CardTitle>
              <CardDescription>إدارة بيانات الموظفين والصلاحيات.</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}>
              <Filter className="h-4 w-4 ml-1.5" />
              الفلاتر
            </Button>
            <Button asChild>
              <Link to="/employees/create">
                <Plus className="h-4 w-4 ml-1.5" />
                إضافة موظف
              </Link>
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
                placeholder="بحث عن موظف..."
                className="pr-9"
              />
            </div>
          </div>

          <ListPageStandardFilters open={filtersOpen} />

          {error && (
            <div className="flex items-center justify-center py-6">
              <p className="text-destructive text-sm">حدث خطأ أثناء تحميل البيانات: {error}</p>
            </div>
          )}

          {!error && (
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
                    <TableSkeletonRows rows={5} cols={columns.length} />
                  ) : rows.length > 0 ? (
                    rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-center text-muted-foreground">{row.id}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="font-mono">{row.employee_code}</Badge>
                        </TableCell>
                        <TableCell className="text-center font-medium">{row.name}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.job_title}</TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.branch_name}</TableCell>
                        <TableCell className="text-center" dir="ltr">{row.phone || "—"}</TableCell>
                        <TableCell className="text-center font-medium">{row.base_salary.toLocaleString()}</TableCell>
                        <TableCell className="text-center">
                          <StatusBadge status={row.employment_status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 justify-center">
                            <Button variant="ghost" size="icon" title="عرض التفاصيل" asChild>
                              <Link to={`/employees/${row.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">
                        لا يوجد موظفون لعرضهم.
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
            إجمالي الموظفين: <span className="font-bold">{stats.total}</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
