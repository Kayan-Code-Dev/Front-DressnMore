import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { DressItem } from "@/features/catalog/dresses/types/dresses.types";
import { getDressMock } from "@/features/catalog/dresses/services/dresses.mock.service";
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
import { Shirt, ArrowRight, ArrowLeftRight, Palette, Ruler } from "lucide-react";

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "info" }> = {
  ready: { label: "جاهز", variant: "success" },
  reserved: { label: "محجوز", variant: "warning" },
  maintenance: { label: "صيانة", variant: "destructive" },
};

const dressDetailExtras: Record<number, { color: string; size: string; rental_price: number; purchase_price: number; notes: string }> = {
  1: { color: "أسود", size: "M", rental_price: 2500, purchase_price: 18000, notes: "فستان سهرة كلاسيكي" },
  2: { color: "أزرق ملكي", size: "L", rental_price: 3200, purchase_price: 22000, notes: "محجوز لحفل زفاف 2026-06-10" },
  3: { color: "أبيض لؤلؤي", size: "S", rental_price: 4000, purchase_price: 28000, notes: "قيد الصيانة — تعديلات خياطة" },
  4: { color: "أخضر زمردي", size: "M", rental_price: 2100, purchase_price: 15000, notes: "متاح للإيجار الفوري" },
};

function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-3 bg-muted/30 border" style={{ borderColor: "var(--color-border)" }}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="text-sm font-semibold mt-0.5">{children}</div>
    </div>
  );
}

export function DressDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const dressId = id ? Number(id) : 0;
  const [loading, setLoading] = useState(true);
  const [dress, setDress] = useState<DressItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDressMock(dressId)
      .then((response) => {
        if (cancelled) return;
        setDress(response.data);
        setError(response.data ? null : "الفستان غير موجود");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "فشل تحميل بيانات الفستان");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [dressId]);

  const extras = dress ? dressDetailExtras[dress.id] : null;
  const statusConfig = dress ? statusMap[dress.status] : null;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/catalog/dresses">
            <ArrowRight className="h-4 w-4 ml-1" />
            العودة للفساتين
          </Link>
        </Button>
        {dress && (
          <Button variant="outline" size="sm" asChild>
            <Link to={`/catalog/dresses/${dress.id}/transfer`}>
              <ArrowLeftRight className="h-4 w-4 ml-1" />
              تحويل بين الفروع
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div
              className="aspect-[3/4] rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #E11D48, #FB7185)" }}
            >
              <Shirt className="w-20 h-20 text-white/80" />
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">صورة توضيحية — سيتم ربط الصور لاحقاً</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #E11D48, #FB7185)" }}
              >
                <Shirt className="w-6 h-6 text-white" />
              </div>
              <div>
                {loading ? (
                  <Skeleton className="h-6 w-48 mb-1" />
                ) : (
                  <>
                    <CardTitle className="text-lg font-black">{dress?.name ?? "—"}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline" className="font-mono">{dress?.code}</Badge>
                    </CardDescription>
                  </>
                )}
              </div>
            </div>
            {!loading && statusConfig && <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>}
          </CardHeader>

          <CardContent>
            {error && <p className="text-destructive text-sm text-center py-6">{error}</p>}

            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            )}

            {!loading && dress && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <DetailField label="القسم">{dress.category?.name ?? "—"}</DetailField>
                  <DetailField label="الفرع">{dress.branch?.name ?? "—"}</DetailField>
                  <DetailField label="اللون">
                    <span className="flex items-center gap-1">
                      <Palette className="h-3.5 w-3.5" />
                      {extras?.color ?? "—"}
                    </span>
                  </DetailField>
                  <DetailField label="المقاس">
                    <span className="flex items-center gap-1">
                      <Ruler className="h-3.5 w-3.5" />
                      {extras?.size ?? "—"}
                    </span>
                  </DetailField>
                  <DetailField label="سعر الإيجار">
                    {extras ? `${extras.rental_price.toLocaleString()} ج.م` : "—"}
                  </DetailField>
                  <DetailField label="سعر الشراء">
                    {extras ? `${extras.purchase_price.toLocaleString()} ج.م` : "—"}
                  </DetailField>
                </div>
                {extras?.notes && (
                  <div className="rounded-xl p-4 border bg-muted/20" style={{ borderColor: "var(--color-border)" }}>
                    <p className="text-xs text-muted-foreground mb-1">ملاحظات</p>
                    <p className="text-sm">{extras.notes}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
