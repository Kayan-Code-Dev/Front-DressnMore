import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getTailoringOrderMock,
  updateMeasurementsMock,
} from "@/features/tailoring/services/tailoring.mock.service";
import { defaultMeasurementFields } from "@/features/tailoring/mocks/tailoring.mock";
import type { TailoringMeasurement } from "@/features/tailoring/types/tailoring.types";
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
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Ruler, Plus, Trash2, CheckCircle } from "lucide-react";

export function EditMeasurementsPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [clientName, setClientName] = useState("");
  const [measurements, setMeasurements] = useState<TailoringMeasurement[]>([]);

  useEffect(() => {
    const orderId = Number(id);
    if (!Number.isFinite(orderId)) {
      setLoading(false);
      return;
    }
    getTailoringOrderMock(orderId)
      .then((res) => {
        if (res.data) {
          setClientName(res.data.client_name);
          setMeasurements(
            res.data.measurements?.length
              ? res.data.measurements
              : defaultMeasurementFields.slice(0, 4).map((label, i) => ({
                  id: i + 1,
                  label,
                  value: "",
                  unit: "سم",
                })),
          );
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const updateField = (index: number, field: "label" | "value" | "unit", value: string) => {
    setMeasurements((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    );
  };

  const addRow = () => {
    setMeasurements((prev) => [
      ...prev,
      { id: Date.now(), label: "", value: "", unit: "سم" },
    ]);
  };

  const removeRow = (index: number) => {
    setMeasurements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const orderId = Number(id);
    if (!Number.isFinite(orderId)) return;
    setSaving(true);
    try {
      await updateMeasurementsMock(orderId, measurements.filter((m) => m.label.trim()));
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full space-y-4" dir="rtl">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (saved) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16" dir="rtl">
        <CheckCircle className="h-16 w-16 text-green-600 mb-4" />
        <h2 className="text-xl font-black mb-2">تم حفظ القياسات بنجاح</h2>
        <div className="flex gap-3 mt-4">
          <Button asChild><Link to={`/tailoring/orders/${id}`}>عرض الأمر</Link></Button>
          <Button variant="outline" onClick={() => setSaved(false)}>متابعة التعديل</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4" dir="rtl">
      <Button variant="ghost" size="sm" asChild>
        <Link to={`/tailoring/orders/${id}`}><ArrowRight className="h-4 w-4 ml-1" /> العودة لتفاصيل الأمر</Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #BE185D, #F472B6)" }}>
              <Ruler className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>
                تعديل القياسات — أمر #{id}
              </CardTitle>
              <CardDescription>العميل: {clientName}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {measurements.map((m, index) => (
            <div key={m.id} className="grid grid-cols-1 sm:grid-cols-[1fr_120px_80px_auto] gap-3 items-end">
              <div>
                {index === 0 && <Label className="mb-1.5 block">المقياس</Label>}
                <Input
                  value={m.label}
                  onChange={(e) => updateField(index, "label", e.target.value)}
                  placeholder="اسم المقياس"
                />
              </div>
              <div>
                {index === 0 && <Label className="mb-1.5 block">القيمة</Label>}
                <Input
                  value={m.value}
                  onChange={(e) => updateField(index, "value", e.target.value)}
                  placeholder="0"
                  dir="ltr"
                />
              </div>
              <div>
                {index === 0 && <Label className="mb-1.5 block">الوحدة</Label>}
                <Input
                  value={m.unit}
                  onChange={(e) => updateField(index, "unit", e.target.value)}
                  placeholder="سم"
                />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeRow(index)} disabled={measurements.length <= 1}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addRow}><Plus className="h-4 w-4 ml-1" /> إضافة مقياس</Button>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link to={`/tailoring/orders/${id}`}>إلغاء</Link>
          </Button>
          <Button disabled={saving} onClick={handleSave}>
            {saving ? "جاري الحفظ..." : "حفظ القياسات"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
