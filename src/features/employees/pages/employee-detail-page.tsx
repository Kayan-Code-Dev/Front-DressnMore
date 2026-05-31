import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { isModuleLive } from "@/config/feature-flags";
import type { EmployeeItem } from "@/features/employees/types/employees.types";
import { getEmployee } from "@/features/employees/services/employees.api.service";
import { getEmployeeMock } from "@/features/employees/services/employees.mock.service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, ArrowRight, Pencil, Shield } from "lucide-react";
import { formatNumber } from "@/shared/lib/format/numbers";

const statusMap: Record<string, { label: string; variant: "success" | "destructive" | "outline" }> = {
  active: { label: "نشط", variant: "success" },
  on_leave: { label: "إجازة", variant: "outline" },
  suspended: { label: "موقوف", variant: "destructive" },
  terminated: { label: "منتهي", variant: "destructive" },
};

function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-3 bg-muted/30 border" style={{ borderColor: "var(--color-border)" }}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="text-sm font-semibold mt-0.5">{children}</div>
    </div>
  );
}

export function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? Number(id) : 0;
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<EmployeeItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = isModuleLive("employees")
      ? () => getEmployee(employeeId).then((data) => ({ data }))
      : () => getEmployeeMock(employeeId);

    load()
      .then((response) => {
        if (cancelled) return;
        setEmployee(response.data);
        setError(response.data ? null : "الموظف غير موجود");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load employee");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [employeeId]);

  const statusConfig = employee ? statusMap[employee.employment_status] : null;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/employees">
            <ArrowRight className="h-4 w-4 ml-1" />
            العودة للموظفين
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #10B981, #34D399)" }}
            >
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              {loading ? (
                <Skeleton className="h-6 w-40 mb-1" />
              ) : (
                <>
                  <CardTitle className="text-lg font-black">{employee?.name ?? "—"}</CardTitle>
                  <CardDescription>{employee?.employee_code}</CardDescription>
                </>
              )}
            </div>
          </div>
          {!loading && statusConfig && (
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          )}
        </CardHeader>

        <CardContent>
          {error && (
            <p className="text-destructive text-sm text-center py-6">{error}</p>
          )}

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          )}

          {!loading && employee && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  البيانات الأساسية
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <DetailField label="البريد الإلكتروني">{employee.email}</DetailField>
                  <DetailField label="الهاتف"><span dir="ltr">{employee.phone}</span></DetailField>
                  <DetailField label="تاريخ التوظيف">{employee.hire_date}</DetailField>
                  <DetailField label="المسمى الوظيفي">{employee.job_title}</DetailField>
                  <DetailField label="الفرع">{employee.branch_name}</DetailField>
                  <DetailField label="الراتب الأساسي">{formatNumber(employee.base_salary)} ج.م</DetailField>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  البدلات والصلاحيات
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <DetailField label="بدل سكن">{formatNumber((employee.housing_allowance ?? 0))} ج.م</DetailField>
                  <DetailField label="بدل مواصلات">{formatNumber((employee.transport_allowance ?? 0))} ج.م</DetailField>
                  <DetailField label="بدلات أخرى">{formatNumber((employee.other_allowances ?? 0))} ج.م</DetailField>
                  <DetailField label="الصلاحيات">
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(employee.roles ?? []).map((role) => (
                        <Badge key={role} variant="outline">{role}</Badge>
                      ))}
                    </div>
                  </DetailField>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap pt-2">
                <Button variant="outline" disabled>
                  <Pencil className="h-4 w-4 ml-1.5" />
                  تعديل
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/employees/custodies">العهد والضمانات</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/employees/salaries">الرواتب</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
