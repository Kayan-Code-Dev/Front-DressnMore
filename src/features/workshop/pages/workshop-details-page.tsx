import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { WorkshopItem, WorkshopTransferItem, WorkshopClothItem } from "@/features/workshop/types/workshop.types";
import {
  getWorkshopMock,
  listWorkshopTransfersMock,
  listWorkshopClothsMock,
} from "@/features/workshop/services/workshop.mock.service";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench, ArrowRight, ArrowLeftRight } from "lucide-react";

const statusMap: Record<string, { label: string; variant: "success" | "destructive" | "outline" }> = {
  active: { label: "نشط", variant: "success" },
  closed: { label: "مغلق", variant: "destructive" },
  under_construction: { label: "قيد الإنشاء", variant: "outline" },
};

const transferStatusMap: Record<string, string> = {
  pending: "قيد الانتظار",
  approved: "تمت الموافقة",
  rejected: "مرفوض",
  completed: "مكتمل",
};

const clothStatusMap: Record<string, string> = {
  processing: "قيد المعالجة",
  received: "تم الاستلام",
  ready_for_delivery: "جاهز للتسليم",
};

function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-3 bg-muted/30 border" style={{ borderColor: "var(--color-border)" }}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="text-sm font-semibold mt-0.5">{children}</div>
    </div>
  );
}

export function WorkshopDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const workshopId = id ? Number(id) : 0;
  const [loading, setLoading] = useState(true);
  const [workshop, setWorkshop] = useState<WorkshopItem | null>(null);
  const [transfers, setTransfers] = useState<WorkshopTransferItem[]>([]);
  const [cloths, setCloths] = useState<WorkshopClothItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getWorkshopMock(workshopId),
      listWorkshopTransfersMock(workshopId),
      listWorkshopClothsMock(workshopId),
    ])
      .then(([workshopRes, transfersRes, clothsRes]) => {
        if (cancelled) return;
        setWorkshop(workshopRes.data);
        setTransfers(transfersRes.data);
        setCloths(clothsRes.data);
        setError(workshopRes.data ? null : "الورشة غير موجودة");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load workshop");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [workshopId]);

  const statusConfig = workshop ? statusMap[workshop.status] : null;

  return (
    <div className="w-full space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/workshop">
          <ArrowRight className="h-4 w-4 ml-1" />
          العودة للورش
        </Link>
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #64748B, #94A3B8)" }}
            >
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              {loading ? (
                <Skeleton className="h-6 w-48" />
              ) : (
                <>
                  <CardTitle className="text-lg font-black">{workshop?.name ?? "—"}</CardTitle>
                  <CardDescription>{workshop?.workshop_code}</CardDescription>
                </>
              )}
            </div>
          </div>
          {!loading && statusConfig && (
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          )}
        </CardHeader>

        <CardContent>
          {error && <p className="text-destructive text-sm text-center py-4">{error}</p>}

          {!error && (
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">التفاصيل</TabsTrigger>
                <TabsTrigger value="transfers">
                  <ArrowLeftRight className="h-4 w-4 ml-1" />
                  التحويلات ({transfers.length})
                </TabsTrigger>
                <TabsTrigger value="cloths">الأقمشة ({cloths.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 rounded-xl" />
                    ))}
                  </div>
                ) : workshop && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <DetailField label="المدينة">{workshop.city}</DetailField>
                    <DetailField label="العنوان">{workshop.address}</DetailField>
                    <DetailField label="المخزن">{workshop.inventory_name}</DetailField>
                    <DetailField label="تاريخ الإنشاء">{workshop.created_at}</DetailField>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="transfers" className="mt-4">
                <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="text-center">الكود</TableHead>
                        <TableHead className="text-center">من</TableHead>
                        <TableHead className="text-center">إلى</TableHead>
                        <TableHead className="text-center">الصنف</TableHead>
                        <TableHead className="text-center">الكمية</TableHead>
                        <TableHead className="text-center">الحالة</TableHead>
                        <TableHead className="text-center">التاريخ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow><TableCell colSpan={7} className="text-center py-8"><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                      ) : transfers.length > 0 ? (
                        transfers.map((t) => (
                          <TableRow key={t.id}>
                            <TableCell className="text-center"><Badge variant="outline">{t.transfer_code}</Badge></TableCell>
                            <TableCell className="text-center text-muted-foreground">{t.from_branch}</TableCell>
                            <TableCell className="text-center text-muted-foreground">{t.to_workshop}</TableCell>
                            <TableCell className="text-center">{t.item_name}</TableCell>
                            <TableCell className="text-center font-medium">{t.quantity}</TableCell>
                            <TableCell className="text-center">{transferStatusMap[t.status] ?? t.status}</TableCell>
                            <TableCell className="text-center text-muted-foreground">{t.created_at}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">لا توجد تحويلات.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="cloths" className="mt-4">
                <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="text-center">الكود</TableHead>
                        <TableHead className="text-center">العميل</TableHead>
                        <TableHead className="text-center">المنتج</TableHead>
                        <TableHead className="text-center">الحالة</TableHead>
                        <TableHead className="text-center">آخر تحديث</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow><TableCell colSpan={5} className="text-center py-8"><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                      ) : cloths.length > 0 ? (
                        cloths.map((c) => (
                          <TableRow key={c.id}>
                            <TableCell className="text-center"><Badge variant="outline">{c.cloth_code}</Badge></TableCell>
                            <TableCell className="text-center">{c.customer_name}</TableCell>
                            <TableCell className="text-center">{c.product_name}</TableCell>
                            <TableCell className="text-center">{clothStatusMap[c.workshop_status] ?? c.workshop_status}</TableCell>
                            <TableCell className="text-center text-muted-foreground">{c.updated_at}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">لا توجد أقمشة.</TableCell>
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
  );
}
