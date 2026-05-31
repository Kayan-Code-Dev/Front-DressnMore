import { useEffect, useMemo, useState } from "react";
import type { SupplierPaymentItem } from "@/features/suppliers/types/suppliers.types";
import { listSupplierPaymentsMock } from "@/features/suppliers/services/suppliers.mock.service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Banknote, Search } from "lucide-react";
import { formatNumber } from "@/shared/lib/format/numbers";

const methodMap: Record<string, string> = {
  cash: "نقدي",
  bank_transfer: "تحويل بنكي",
  check: "شيك",
};

function TableSkeletonRows({ rows = 5, cols = 7 }: { rows?: number; cols?: number }) {
  return (<>{Array.from({ length: rows }).map((_, i) => (<TableRow key={i}>{Array.from({ length: cols }).map((__, j) => (<TableCell key={j} className="text-center"><Skeleton className="h-5 w-full max-w-[100px] mx-auto" /></TableCell>))}</TableRow>))}</>);
}

export function SupplierPaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<SupplierPaymentItem[]>([]);

  const handleSearchChange = (value: string) => { setLoading(true); setSearch(value); };

  useEffect(() => {
    listSupplierPaymentsMock(search)
      .then((response) => setRows(response.data))
      .finally(() => setLoading(false));
  }, [search]);

  const columns = useMemo(() => [
    { key: "id", title: "#" },
    { key: "supplier", title: "المورد" },
    { key: "purchase_order_number", title: "رقم أمر الشراء" },
    { key: "amount", title: "المبلغ" },
    { key: "method", title: "طريقة الدفع" },
    { key: "reference", title: "المرجع" },
    { key: "paid_at", title: "تاريخ الدفع" },
  ], []);

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #6366F1, #818CF8)" }}>
              <Banknote className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>مدفوعات الموردين</CardTitle>
              <CardDescription>عرض سجل المدفوعات للموردين.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input value={search} onChange={(e) => handleSearchChange(e.target.value)} placeholder="بحث في مدفوعات الموردين..." className="pr-9" />
            </div>
          </div>
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
            <Table>
              <TableHeader><TableRow className="bg-muted/30">{columns.map((col) => (<TableHead key={col.key} className="text-center font-bold text-xs">{col.title}</TableHead>))}</TableRow></TableHeader>
              <TableBody>
                {loading ? (<TableSkeletonRows rows={5} cols={columns.length} />) : rows.length > 0 ? (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-center text-muted-foreground">{row.id}</TableCell>
                      <TableCell className="text-center font-medium">{row.supplier}</TableCell>
                      <TableCell className="text-center"><Badge variant="outline" className="font-mono">{row.purchase_order_number}</Badge></TableCell>
                      <TableCell className="text-center font-medium">{formatNumber(row.amount)}</TableCell>
                      <TableCell className="text-center"><Badge variant="secondary">{methodMap[row.method] ?? row.method}</Badge></TableCell>
                      <TableCell className="text-center text-muted-foreground text-xs">{row.reference || "—"}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{row.paid_at}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">لا توجد مدفوعات لعرضها.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">إجمالي السجلات: <span className="font-bold">{rows.length}</span></p>
        </CardFooter>
      </Card>
    </div>
  );
}
