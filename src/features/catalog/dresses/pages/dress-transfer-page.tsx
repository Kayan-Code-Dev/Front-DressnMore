import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import type { DressItem } from "@/features/catalog/dresses/types/dresses.types";
import { getDressMock } from "@/features/catalog/dresses/services/dresses.mock.service";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowLeftRight, ArrowRight, Shirt, Loader2 } from "lucide-react";

const branches = ["القاهرة", "الإسكندرية", "الجيزة", "المنصورة"];

export function DressTransferPage() {
  const { id } = useParams<{ id: string }>();
  const dressId = id ? Number(id) : 0;
  const [loading, setLoading] = useState(true);
  const [dress, setDress] = useState<DressItem | null>(null);
  const [toBranch, setToBranch] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getDressMock(dressId)
      .then((res) => {
        if (!cancelled) setDress(res.data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [dressId]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!toBranch) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccessOpen(true);
    }, 600);
  };

  return (
    <div className="w-full space-y-4 max-w-2xl mx-auto">
      <Button variant="ghost" size="sm" asChild>
        <Link to={dressId ? `/catalog/dresses/${dressId}` : "/catalog/dresses"}>
          <ArrowRight className="h-4 w-4 ml-1" />
          العودة للفستان
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #3B82F6, #60A5FA)" }}
            >
              <ArrowLeftRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black">تحويل فستان بين الفروع</CardTitle>
              <CardDescription>طلب نقل فستان من فرع إلى آخر — واجهة عرض فقط.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : dress ? (
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="rounded-xl border p-4 flex items-center gap-3 bg-muted/20" style={{ borderColor: "var(--color-border)" }}>
                <Shirt className="h-8 w-8 text-rose-500" />
                <div>
                  <p className="font-bold">{dress.name}</p>
                  <p className="text-sm text-muted-foreground">
                    <Badge variant="outline" className="font-mono ml-2">{dress.code}</Badge>
                    الفرع الحالي: <span className="font-semibold">{dress.branch}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>الفرع الحالي</Label>
                <Input value={dress.branch} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="to-branch">الفرع المستهدف *</Label>
                <Select value={toBranch} onValueChange={setToBranch}>
                  <SelectTrigger id="to-branch">
                    <SelectValue placeholder="اختر الفرع" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches
                      .filter((b) => b !== dress.branch)
                      .map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="سبب التحويل أو تعليمات إضافية..."
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting || !toBranch}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <ArrowLeftRight className="h-4 w-4 ml-2" />
                    إرسال طلب التحويل
                  </>
                )}
              </Button>
            </form>
          ) : (
            <p className="text-center text-muted-foreground py-8">الفستان غير موجود.</p>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">سيتم مراجعة طلب التحويل من قبل مدير الفرع المستهدف.</p>
        </CardFooter>
      </Card>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تم إرسال الطلب</DialogTitle>
            <DialogDescription>
              طلب تحويل الفستان {dress?.name} إلى فرع {toBranch} قيد المراجعة.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuccessOpen(false)}>إغلاق</Button>
            <Button asChild>
              <Link to={dressId ? `/catalog/dresses/${dressId}` : "/catalog/dresses"}>العودة للفستان</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
