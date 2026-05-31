import { useEffect, useMemo, useState } from "react";
import { ListPageStandardFilters } from "@/components/shared/ListPageStandardFilters";
import type { AccountingSummary, LedgerEntry } from "@/features/accounting/types/accounting.types";
import { getAccountingSummaryMock, listLedgerMock } from "@/features/accounting/services/accounting.mock.service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calculator, Search, Filter } from "lucide-react";
import { formatNumber } from "@/shared/lib/format/numbers";

function TableSkeletonRows({ rows = 5, cols = 7 }: { rows?: number; cols?: number }) {
  return (<>{Array.from({ length: rows }).map((_, i) => (<TableRow key={i}>{Array.from({ length: cols }).map((__, j) => (<TableCell key={j} className="text-center"><Skeleton className="h-5 w-full max-w-[100px] mx-auto" /></TableCell>))}</TableRow>))}</>);
}

export function AccountingSummaryPage() {
  const [summary, setSummary] = useState<AccountingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<LedgerEntry[]>([]);

  const handleSearchChange = (value: string) => { setLoading(true); setSearch(value); };

  useEffect(() => {
    getAccountingSummaryMock().then((response) => setSummary(response.data));
  }, []);

  useEffect(() => {
    listLedgerMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

  const columns = useMemo(() => [
    { key: "date", title: "التاريخ" },
    { key: "type", title: "النوع" },
    { key: "reference", title: "المرجع" },
    { key: "description", title: "الوصف" },
    { key: "debit", title: "مدين" },
    { key: "credit", title: "دائن" },
    { key: "balance", title: "الرصيد" },
  ], []);

  return (
    <div className="w-full space-y-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #0369A1, #0EA5E9)" }}>
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>ملخص المحاسبة</CardTitle>
              <CardDescription>نظرة عامة على الحسابات والقيود.</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">إجمالي الدخل</p>
            {summary ? <p className="text-2xl font-bold text-emerald-600">{formatNumber(summary.total_income)}</p> : <Skeleton className="h-8 w-28" />}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">إجمالي المصروفات</p>
            {summary ? <p className="text-2xl font-bold text-red-600">{formatNumber(summary.total_expenses)}</p> : <Skeleton className="h-8 w-28" />}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">صافي التغيير</p>
            {summary ? <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>{formatNumber(summary.net_change)}</p> : <Skeleton className="h-8 w-28" />}
          </CardContent>
        </Card>
      </div>

      {summary && summary.cashbox_balances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>أرصدة الصناديق</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {summary.cashbox_balances.map((cb) => (
                <div key={cb.name} className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "var(--color-border)" }}>
                  <span className="text-sm text-muted-foreground">{cb.name}:</span>
                  <span className="font-bold">{formatNumber(cb.balance)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>سجل القيود</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={() => setFiltersOpen((v) => !v)}><Filter className="h-4 w-4 ml-1.5" />الفلاتر</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input value={search} onChange={(e) => handleSearchChange(e.target.value)} placeholder="بحث في القيود..." className="pr-9" />
            </div>
          </div>
          <ListPageStandardFilters open={filtersOpen} />
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
            <Table>
              <TableHeader><TableRow className="bg-muted/30">{columns.map((col) => (<TableHead key={col.key} className="text-center font-bold text-xs">{col.title}</TableHead>))}</TableRow></TableHeader>
              <TableBody>
                {loading ? (<TableSkeletonRows rows={5} cols={columns.length} />) : rows.length > 0 ? (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-center text-muted-foreground">{row.date}</TableCell>
                      <TableCell className="text-center"><Badge variant={row.type === "debit" ? "destructive" : "success"}>{row.type === "debit" ? "مدين" : "دائن"}</Badge></TableCell>
                      <TableCell className="text-center text-muted-foreground text-xs">{row.reference}</TableCell>
                      <TableCell className="text-center text-xs max-w-[200px] truncate">{row.description}</TableCell>
                      <TableCell className="text-center font-medium">{formatNumber(row.debit)}</TableCell>
                      <TableCell className="text-center font-medium">{formatNumber(row.credit)}</TableCell>
                      <TableCell className="text-center font-bold">{formatNumber(row.balance)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">لا توجد قيود لعرضها.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter><p className="text-sm text-muted-foreground">إجمالي القيود: <span className="font-bold">{rows.length}</span></p></CardFooter>
      </Card>
    </div>
  );
}
