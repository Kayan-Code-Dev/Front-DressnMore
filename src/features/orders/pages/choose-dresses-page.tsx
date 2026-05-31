import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { OrderStepsStepper } from "@/components/custom/OrderStepsStepper";
import { listDressOptionsMock } from "@/features/orders/services/orders.mock.service";
import type { CreateOrderDraft, DressOption } from "@/features/orders/types/orders.types";
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
import { Shirt, ArrowRight, ArrowLeft, Search, Plus, Check } from "lucide-react";

export function ChooseDressesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const draft = (location.state as { draft?: CreateOrderDraft } | null)?.draft;

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dresses, setDresses] = useState<DressOption[]>([]);
  const [selected, setSelected] = useState<DressOption[]>(draft?.items ?? []);

  useEffect(() => {
    if (!draft) {
      navigate("/orders/choose-client", { replace: true });
    }
  }, [draft, navigate]);

  useEffect(() => {
    listDressOptionsMock(search)
      .then((res) => setDresses(res.data))
      .finally(() => setLoading(false));
  }, [search]);

  const toggleDress = (dress: DressOption) => {
    if (!dress.available) return;
    setSelected((prev) => {
      const exists = prev.find((d) => d.id === dress.id);
      if (exists) return prev.filter((d) => d.id !== dress.id);
      return [...prev, dress];
    });
  };

  const totalPrice = selected.reduce((s, d) => s + d.rental_price, 0);

  const handleNext = () => {
    if (!draft || selected.length === 0) return;
    navigate("/orders/create-order", {
      state: { draft: { ...draft, items: selected } },
    });
  };

  if (!draft) return null;

  return (
    <div className="w-full space-y-6" dir="rtl">
      <OrderStepsStepper
        currentStep={2}
        allowNextStep={selected.length > 0}
        allowCurrentStepClick={selected.length > 0}
        stepState={{ 3: { draft: { ...draft, items: selected } } }}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "linear-gradient(135deg, #5170FF, #818CF8)" }}
              >
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>
                  الخطوة 2: اختيار الأزياء
                </CardTitle>
                <CardDescription>
                  العميل: {draft.client_name} — اختر الأزياء المراد تأجيرها
                </CardDescription>
              </div>
            </div>
            <Badge variant="info">{selected.length} صنف محدد — {totalPrice.toLocaleString("ar-EG")} ج.م</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-sm mb-4">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setLoading(true); setSearch(e.target.value); }}
              placeholder="بحث بالاسم أو الكود..."
              className="pr-9"
            />
          </div>

          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="text-center font-bold text-xs w-12">اختيار</TableHead>
                  <TableHead className="text-center font-bold text-xs">الاسم</TableHead>
                  <TableHead className="text-center font-bold text-xs">الكود</TableHead>
                  <TableHead className="text-center font-bold text-xs">الفئة</TableHead>
                  <TableHead className="text-center font-bold text-xs">المقاس</TableHead>
                  <TableHead className="text-center font-bold text-xs">السعر</TableHead>
                  <TableHead className="text-center font-bold text-xs">التوفر</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((__, j) => (
                        <TableCell key={j} className="text-center"><Skeleton className="h-5 w-full max-w-[80px] mx-auto" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : dresses.map((dress) => {
                  const isSelected = selected.some((d) => d.id === dress.id);
                  return (
                    <TableRow
                      key={dress.id}
                      className={isSelected ? "bg-[#5170ff]/5" : dress.available ? "cursor-pointer hover:bg-muted/30" : "opacity-50"}
                      onClick={() => toggleDress(dress)}
                    >
                      <TableCell className="text-center">
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          size="icon"
                          className="h-7 w-7"
                          disabled={!dress.available}
                          onClick={(e) => { e.stopPropagation(); toggleDress(dress); }}
                        >
                          {isSelected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        </Button>
                      </TableCell>
                      <TableCell className="text-center font-medium">{dress.name}</TableCell>
                      <TableCell className="text-center"><Badge variant="outline" className="font-mono">{dress.code}</Badge></TableCell>
                      <TableCell className="text-center text-muted-foreground">{dress.category}</TableCell>
                      <TableCell className="text-center">{dress.size}</TableCell>
                      <TableCell className="text-center">{dress.rental_price.toLocaleString("ar-EG")} ج.م</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={dress.available ? "success" : "destructive"}>
                          {dress.available ? "متاح" : "غير متاح"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Button variant="outline" asChild>
            <Link to="/orders/choose-client" state={{ draft }}><ArrowRight className="h-4 w-4 ml-1" /> السابق</Link>
          </Button>
          <Button disabled={selected.length === 0} onClick={handleNext}>
            التالي: المراجعة
            <ArrowLeft className="h-4 w-4 mr-1.5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
