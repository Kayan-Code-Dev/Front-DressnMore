import { useEffect, useMemo, useState } from "react";
import { isModuleLive } from "@/config/feature-flags";
import type { PurchaseOrderItem, SupplierItem, SupplierPaymentItem } from "@/features/suppliers/types/suppliers.types";
import { listSuppliersMock } from "@/features/suppliers/services/suppliers.mock.service";
import { listSuppliers } from "@/features/suppliers/services/suppliers.api.service";
import {
  getSupplierAccount,
  type SupplierReturnLine,
  type SupplierStatementLine,
} from "@/features/suppliers/services/supplier-accounts.api.service";
import {
  purchaseOrdersFixture,
  supplierPaymentsFixture,
} from "@/features/suppliers/mocks/suppliers.mock";
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/shared/lib/format/numbers";

const poStatusMap: Record<string, { label: string; variant: "success" | "warning" | "outline" | "destructive" }> = {
  open: { label: "مفتوح", variant: "warning" },
  partially_paid: { label: "مدفوع جزئياً", variant: "outline" },
  paid: { label: "مدفوع", variant: "success" },
  returned: { label: "مرتجع", variant: "destructive" },
};

const methodLabels: Record<string, string> = {
  cash: "نقدي",
  bank_transfer: "تحويل بنكي",
  check: "شيك",
};

const supplierReturnsFixture = [
  { id: 1, return_number: "RET-501", date: "2026-05-20", amount: 1200, reason: "عيب في القماش" },
  { id: 2, return_number: "RET-502", date: "2026-05-15", amount: 800, reason: "كمية ناقصة" },
];

const statementLinesFixture = [
  { id: 1, date: "2026-06-01", description: "فاتورة شراء PO-1001", debit: 32000, credit: 0, balance: 32000 },
  { id: 2, date: "2026-06-02", description: "دفعة TXN-8701", debit: 0, credit: 6000, balance: 26000 },
  { id: 3, date: "2026-06-05", description: "مرتجع RET-501", debit: 0, credit: 1200, balance: 24800 },
];

export function SupplierAccountsPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [suppliers, setSuppliers] = useState<SupplierItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [orders, setOrders] = useState<PurchaseOrderItem[]>([]);
  const [payments, setPayments] = useState<SupplierPaymentItem[]>([]);
  const [returns, setReturns] = useState<SupplierReturnLine[]>([]);
  const [statement, setStatement] = useState<SupplierStatementLine[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const loadSuppliers = isModuleLive("suppliers")
      ? () => listSuppliers({ search, per_page: 100 })
      : () => listSuppliersMock(search);

    loadSuppliers()
      .then((response) => {
        if (cancelled) return;
        setSuppliers(response.data);
        if (response.data.length > 0) {
          setSelectedId((prev) => prev ?? response.data[0].id);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [search]);

  useEffect(() => {
    if (!selectedId) {
      setOrders([]);
      setPayments([]);
      setReturns([]);
      setStatement([]);
      return;
    }

    if (!isModuleLive("suppliers")) {
      const selected = suppliers.find((s) => s.id === selectedId) ?? null;
      setOrders(selected ? purchaseOrdersFixture.filter((po) => po.supplier === selected.name) : []);
      setPayments(selected ? supplierPaymentsFixture.filter((p) => p.supplier === selected.name) : []);
      setReturns(supplierReturnsFixture);
      setStatement(statementLinesFixture);
      return;
    }

    let cancelled = false;
    getSupplierAccount(selectedId)
      .then((response) => {
        if (cancelled) return;
        setOrders(response.data.purchase_orders);
        setPayments(response.data.payments);
        setReturns(response.data.returns);
        setStatement(response.data.statement);
      })
      .catch(() => {
        if (cancelled) return;
        setOrders([]);
        setPayments([]);
        setReturns([]);
        setStatement([]);
      });
    return () => { cancelled = true; };
  }, [selectedId, suppliers]);

  const selected = useMemo(
    () => suppliers.find((s) => s.id === selectedId) ?? null,
    [suppliers, selectedId]
  );

  return (
    <div className="w-full">
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #7C3AED, #A78BFA)" }}
            >
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black">حسابات الموردين</CardTitle>
              <CardDescription>عرض أوامر الشراء والمدفوعات والمرتجعات وكشف الحساب لكل مورد.</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold">الموردون</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => { setLoading(true); setSearch(e.target.value); }}
                placeholder="بحث..."
                className="pr-9"
              />
            </div>
            <div className="space-y-1 max-h-[420px] overflow-y-auto">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)
              ) : suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <button
                    key={supplier.id}
                    type="button"
                    onClick={() => setSelectedId(supplier.id)}
                    className={cn(
                      "w-full text-right rounded-lg border p-3 transition-colors",
                      selectedId === supplier.id ? "bg-primary/10 border-primary" : "hover:bg-muted/40"
                    )}
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <p className="font-semibold text-sm">{supplier.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{supplier.code}</p>
                    <p className="text-xs font-bold mt-1">{formatNumber(supplier.current_balance)} ج.م</p>
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">لا يوجد موردون.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-9">
          <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
            {selected ? (
              <div>
                <CardTitle className="text-base font-black">{selected.name}</CardTitle>
                <CardDescription>
                  الرصيد الحالي: <span className="font-bold">{formatNumber(selected.current_balance)} ج.م</span>
                </CardDescription>
              </div>
            ) : (
              <CardDescription>اختر مورداً من القائمة.</CardDescription>
            )}
            {selected && (
              <Badge variant={selected.status === "active" ? "success" : "destructive"}>
                {selected.status === "active" ? "نشط" : "غير نشط"}
              </Badge>
            )}
          </CardHeader>

          <CardContent>
            {!selected ? (
              <p className="text-center text-muted-foreground py-12">اختر مورداً لعرض تفاصيل حسابه.</p>
            ) : (
              <Tabs defaultValue="orders">
                <TabsList className="flex-wrap h-auto">
                  <TabsTrigger value="orders">أوامر الشراء ({orders.length})</TabsTrigger>
                  <TabsTrigger value="payments">المدفوعات ({payments.length})</TabsTrigger>
                  <TabsTrigger value="returns">المرتجعات</TabsTrigger>
                  <TabsTrigger value="statement">كشف الحساب</TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="mt-4">
                  <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="text-center">رقم الأمر</TableHead>
                          <TableHead className="text-center">التاريخ</TableHead>
                          <TableHead className="text-center">الإجمالي</TableHead>
                          <TableHead className="text-center">المدفوع</TableHead>
                          <TableHead className="text-center">المتبقي</TableHead>
                          <TableHead className="text-center">الحالة</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.length > 0 ? (
                          orders.map((row: PurchaseOrderItem) => {
                            const st = poStatusMap[row.status] ?? { label: row.status, variant: "outline" as const };
                            return (
                              <TableRow key={row.id}>
                                <TableCell className="text-center font-mono text-xs">{row.purchase_order_number}</TableCell>
                                <TableCell className="text-center text-muted-foreground">{row.order_date}</TableCell>
                                <TableCell className="text-center">{formatNumber(row.total)}</TableCell>
                                <TableCell className="text-center">{formatNumber(row.paid_amount)}</TableCell>
                                <TableCell className="text-center font-medium">{formatNumber(row.remaining_amount)}</TableCell>
                                <TableCell className="text-center"><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                              لا توجد أوامر شراء.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="payments" className="mt-4">
                  <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="text-center">المرجع</TableHead>
                          <TableHead className="text-center">أمر الشراء</TableHead>
                          <TableHead className="text-center">المبلغ</TableHead>
                          <TableHead className="text-center">الطريقة</TableHead>
                          <TableHead className="text-center">التاريخ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.length > 0 ? (
                          payments.map((row: SupplierPaymentItem) => (
                            <TableRow key={row.id}>
                              <TableCell className="text-center font-mono text-xs">{row.reference}</TableCell>
                              <TableCell className="text-center text-muted-foreground">{row.purchase_order_number}</TableCell>
                              <TableCell className="text-center font-medium">{formatNumber(row.amount)}</TableCell>
                              <TableCell className="text-center">{methodLabels[row.method] ?? row.method}</TableCell>
                              <TableCell className="text-center text-muted-foreground">{row.paid_at}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                              لا توجد مدفوعات.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="returns" className="mt-4">
                  <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="text-center">رقم المرتجع</TableHead>
                          <TableHead className="text-center">التاريخ</TableHead>
                          <TableHead className="text-center">المبلغ</TableHead>
                          <TableHead className="text-center">السبب</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {returns.length > 0 ? (
                          returns.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell className="text-center font-mono text-xs">{row.return_number}</TableCell>
                              <TableCell className="text-center text-muted-foreground">{row.date}</TableCell>
                              <TableCell className="text-center font-medium">{formatNumber(row.amount)}</TableCell>
                              <TableCell className="text-center text-sm">{row.reason}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                              لا توجد مرتجعات.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="statement" className="mt-4">
                  <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="text-center">التاريخ</TableHead>
                          <TableHead className="text-center">الوصف</TableHead>
                          <TableHead className="text-center">مدين</TableHead>
                          <TableHead className="text-center">دائن</TableHead>
                          <TableHead className="text-center">الرصيد</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {statement.length > 0 ? (
                          statement.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell className="text-center text-muted-foreground">{row.date}</TableCell>
                              <TableCell className="text-center text-sm">{row.description}</TableCell>
                              <TableCell className="text-center">{row.debit ? formatNumber(row.debit) : "—"}</TableCell>
                              <TableCell className="text-center">{row.credit ? formatNumber(row.credit) : "—"}</TableCell>
                              <TableCell className="text-center font-bold">{formatNumber(row.balance)}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                              لا توجد حركات في كشف الحساب.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
