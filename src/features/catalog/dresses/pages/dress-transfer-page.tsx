import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { isModuleLive } from "@/config/feature-flags";
import type { DressItem } from "@/features/catalog/dresses/types/dresses.types";
import { getDress, transferDress } from "@/features/catalog/dresses/services/dresses.api.service";
import { getDressMock } from "@/features/catalog/dresses/services/dresses.mock.service";
import { listBranches } from "@/features/branches/services/branches.api.service";
import { listBranchesMock } from "@/features/branches/services/branches.mock.service";
import type { BranchItem } from "@/features/branches/types/branches.types";
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
import { dressDisplayName } from "@/features/catalog/dresses/lib/dress-display";
import { ArrowLeftRight, ArrowRight, Shirt, Loader2 } from "lucide-react";

export function DressTransferPage() {
  const { id } = useParams<{ id: string }>();
  const dressId = id ? Number(id) : 0;
  const [loading, setLoading] = useState(true);
  const [dress, setDress] = useState<DressItem | null>(null);
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [toBranchId, setToBranchId] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const live = isModuleLive("dresses");

  useEffect(() => {
    let cancelled = false;
    const loadDress = live
      ? () => getDress(dressId)
      : () => getDressMock(dressId);

    loadDress()
      .then((res) => {
        if (!cancelled) setDress(res.data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [dressId, live]);

  useEffect(() => {
    let cancelled = false;
    const loadBranches = live
      ? () => listBranches({ per_page: 100 })
      : () => listBranchesMock();

    loadBranches()
      .then((response) => {
        if (cancelled) return;
        const rows = "data" in response ? response.data : [];
        setBranches(Array.isArray(rows) ? rows : []);
      })
      .catch(() => {
        if (!cancelled) setBranches([]);
      });
    return () => { cancelled = true; };
  }, [live]);

  const targetBranchName = useMemo(
    () => branches.find((b) => String(b.id) === toBranchId)?.name ?? "",
    [branches, toBranchId],
  );

  const availableBranches = useMemo(
    () => branches.filter((branch) => branch.id !== dress?.branch?.id),
    [branches, dress?.branch?.id],
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!toBranchId) return;
    setSubmitting(true);
    setError(null);

    try {
      if (live) {
        await transferDress(dressId, {
          to_branch_id: Number(toBranchId),
          notes: notes || undefined,
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      setSuccessOpen(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to transfer dress");
    } finally {
      setSubmitting(false);
    }
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
              <CardDescription>نقل فستان من فرع إلى آخر مع تسجيل حركة المخزون.</CardDescription>
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
                  <p className="font-bold" dir="ltr">{dressDisplayName(dress)}</p>
                  <p className="text-sm text-muted-foreground">
                    <Badge variant="outline" className="font-mono ml-2">{dress.code}</Badge>
                    {dress.category?.name ?? "—"} / {dress.subcategory?.name ?? "—"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>الفرع الحالي</Label>
                <Input value={dress.branch?.name ?? "—"} disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="to-branch">الفرع المستهدف *</Label>
                <Select value={toBranchId} onValueChange={setToBranchId}>
                  <SelectTrigger id="to-branch">
                    <SelectValue placeholder="اختر الفرع" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBranches.map((branch) => (
                      <SelectItem key={branch.id} value={String(branch.id)}>
                        {branch.name}
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

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <Button type="submit" className="w-full" disabled={submitting || !toBranchId}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    جاري التحويل...
                  </>
                ) : (
                  <>
                    <ArrowLeftRight className="h-4 w-4 ml-2" />
                    تنفيذ التحويل
                  </>
                )}
              </Button>
            </form>
          ) : (
            <p className="text-center text-muted-foreground py-8">الفستان غير موجود.</p>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">يتم تسجيل التحويل كحركة مخزون بين الفروع.</p>
        </CardFooter>
      </Card>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>تم التحويل</DialogTitle>
            <DialogDescription>
              تم تحويل الفستان {dress?.name} إلى فرع {targetBranchName || "المستهدف"}.
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
