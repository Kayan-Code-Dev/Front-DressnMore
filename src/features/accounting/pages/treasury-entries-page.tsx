import { useEffect, useMemo, useState } from "react";
import { isModuleLive } from "@/config/feature-flags";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import type { TreasuryEntry } from "@/features/accounting/types/accounting.types";
import { listTreasuryEntriesMock } from "@/features/accounting/services/accounting.mock.service";
import { listTreasuryEntries } from "@/features/accounting/services/accounting.api.service";
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
import { BookOpen, Search, Filter } from "lucide-react";
import { formatNumber } from "@/shared/lib/format/numbers";

const statusMap: Record<string, { label: string; variant: "success" | "outline" | "destructive" }> = {
  posted: { label: "مرحّل", variant: "success" },
  draft: { label: "مسودة", variant: "outline" },
  cancelled: { label: "ملغى", variant: "destructive" },
};

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

export function TreasuryEntriesPage() {
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<TreasuryEntry[]>([]);

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
  };

  useEffect(() => {
    let cancelled = false;
    if (isModuleLive("accounting")) {
      listTreasuryEntries({ search })
        .then((response) => {
          if (cancelled) return;
          setRows(response.data);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => { cancelled = true; };
    }

    listTreasuryEntriesMock(search)
      .then((response) => {
        if (cancelled) return;
        setRows(response.data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [search]);

  const stats = useMemo(() => {
    const posted = rows.filter((r) => r.status === "posted");
    const totalDebit = posted.reduce((s, r) => s + r.debit, 0);
    const totalCredit = posted.reduce((s, r) => s + r.credit, 0);
    return {
      total: rows.length,
      posted: posted.length,
      draft: rows.filter((r) => r.status === "draft").length,
      totalDebit,
      totalCredit,
    };
  }, [rows]);

  const columns = useMemo(
    () => [
      { key: "entry", title: "رقم القيد" },
      { key: "date", title: "التاريخ" },
      { key: "account", title: "الحساب" },
      { key: "description", title: "الوصف" },
      { key: "debit", title: "مدين" },
      { key: "credit", title: "دائن" },
      { key: "status", title: "الحالة" },
      { key: "by", title: "بواسطة" },
    ],
    []
  );

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #0369A1, #0EA5E9)" }}
            >
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black">قيود الخزينة</CardTitle>
              <CardDescription>سجل قيود اليومية مع الإحصائيات والفلاتر.</CardDescription>
            </div>
          </div>
          <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}>
            <Filter className="h-4 w-4 ml-1.5" />
            الفلاتر
          </Button>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">إجمالي القيود</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">مرحّلة</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.posted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">مسودات</p>
            <p className="text-2xl font-bold text-amber-600">{stats.draft}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">إجمالي مدين</p>
            <p className="text-2xl font-bold">{formatNumber(stats.totalDebit)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">إجمالي دائن</p>
            <p className="text-2xl font-bold">{formatNumber(stats.totalCredit)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="بحث في القيود..."
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
                  rows.map((row) => {
                    const st = statusMap[row.status] ?? { label: row.status, variant: "outline" as const };
                    return (
                      <TableRow key={row.id}>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="font-mono">
                            {row.entry_number}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">{row.date}</TableCell>
                        <TableCell className="text-center text-sm">{row.account}</TableCell>
                        <TableCell className="text-center text-xs max-w-[160px] truncate">{row.description}</TableCell>
                        <TableCell className="text-center font-medium">
                          {row.debit ? formatNumber(row.debit) : "—"}
                        </TableCell>
                        <TableCell className="text-center font-medium">
                          {row.credit ? formatNumber(row.credit) : "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={st.variant}>{st.label}</Badge>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground text-xs">{row.created_by}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">
                      لا توجد قيود لعرضها.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            إجمالي القيود المعروضة: <span className="font-bold">{rows.length}</span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
