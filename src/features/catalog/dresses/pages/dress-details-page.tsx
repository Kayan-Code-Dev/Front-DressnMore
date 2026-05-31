import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { isModuleLive } from "@/config/feature-flags";
import type { DressItem } from "@/features/catalog/dresses/types/dresses.types";
import { getDressMock } from "@/features/catalog/dresses/services/dresses.mock.service";
import { getDress } from "@/features/catalog/dresses/services/dresses.api.service";
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
import { dressDisplayName } from "@/features/catalog/dresses/lib/dress-display";
import { formatNumber } from "@/shared/lib/format/numbers";
import { Shirt, ArrowRight, ArrowLeftRight } from "lucide-react";

const statusMap: Record<string, { label: string; variant: "success" | "warning" | "destructive" | "info" }> = {
  available: { label: "متاح", variant: "success" },
  rented: { label: "مؤجر", variant: "warning" },
  sold: { label: "مباع", variant: "info" },
  maintenance: { label: "صيانة", variant: "destructive" },
  unavailable: { label: "غير متاح", variant: "destructive" },
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
    const load = isModuleLive("dresses") ? getDress : getDressMock;
    load(dressId)
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

  const statusConfig = dress ? statusMap[dress.status] : null;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dresses">
            <ArrowRight className="h-4 w-4 ml-1" />
            العودة للفساتين
          </Link>
        </Button>
        {dress && (
          <Button variant="outline" size="sm" asChild>
            <Link to={`/dresses/${dress.id}/transfer`}>
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
                    <CardTitle className="text-lg font-black" dir="ltr">{dress ? dressDisplayName(dress) : "—"}</CardTitle>
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
                  <DetailField label="القسم الفرعي">{dress.subcategory?.name ?? "—"}</DetailField>
                  <DetailField label="اللون">{dress.color ?? "—"}</DetailField>
                  <DetailField label="المقاس">{dress.size ?? "—"}</DetailField>
                  <DetailField label="الوصف">{dress.description ?? dress.notes ?? "—"}</DetailField>
                  <DetailField label="سعر الإيجار">
                    {dress.rental_price != null ? `${formatNumber(dress.rental_price)} ج.م` : "—"}
                  </DetailField>
                  <DetailField label="سعر الشراء">
                    {dress.purchase_price != null ? `${formatNumber(dress.purchase_price)} ج.م` : "—"}
                  </DetailField>
                </div>
                {dress.notes && (
                  <div className="rounded-xl p-4 border bg-muted/20" style={{ borderColor: "var(--color-border)" }}>
                    <p className="text-xs text-muted-foreground mb-1">ملاحظات</p>
                    <p className="text-sm">{dress.notes}</p>
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
