import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OrderStepsStepper } from "@/components/custom/OrderStepsStepper";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, ArrowLeft, Search } from "lucide-react";

const mockClients = [
  { id: 1, name: "سارة أحمد", phone: "+201012345678" },
  { id: 2, name: "نور حسن", phone: "+201098765432" },
  { id: 3, name: "مريم خالد", phone: "+201055566677" },
  { id: 4, name: "هبة يوسف", phone: "+201033344455" },
];

const mockEmployees = ["محمد علي", "فاطمة محمود", "أحمد سعيد"];

export function ChooseClientPage() {
  const navigate = useNavigate();
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [visitDate, setVisitDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [employee, setEmployee] = useState("");
  const [notes, setNotes] = useState("");

  const filteredClients = mockClients.filter(
    (c) =>
      !clientSearch.trim() ||
      c.name.includes(clientSearch) ||
      c.phone.includes(clientSearch),
  );

  const selectedClient = mockClients.find((c) => c.id === selectedClientId);
  const canProceed = selectedClient && visitDate && deliveryDate && returnDate && employee;

  const handleNext = () => {
    if (!canProceed || !selectedClient) return;
    navigate("/orders/choose-clothes", {
      state: {
        draft: {
          client_id: selectedClient.id,
          client_name: selectedClient.name,
          client_phone: selectedClient.phone,
          visit_date: visitDate,
          delivery_date: deliveryDate,
          return_date: returnDate,
          employee_name: employee,
          notes,
          items: [],
        },
      },
    });
  };

  return (
    <div className="w-full space-y-6" dir="rtl">
      <OrderStepsStepper currentStep={1} allowNextStep={!!canProceed} />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #5170FF, #818CF8)" }}
            >
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black" style={{ color: "var(--color-text-primary)" }}>
                الخطوة 1: اختيار العميل
              </CardTitle>
              <CardDescription>حدد العميل وتواريخ الفاتورة والموظف المسؤول.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="mb-2 block">بحث عن عميل</Label>
            <div className="relative max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                placeholder="اسم أو رقم هاتف..."
                className="pr-9"
              />
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl">
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => setSelectedClientId(client.id)}
                  className={`rounded-lg border p-3 text-right transition-colors ${
                    selectedClientId === client.id
                      ? "border-[#5170ff] bg-[#5170ff]/5 ring-1 ring-[#5170ff]/20"
                      : "hover:bg-muted/50"
                  }`}
                  style={{ borderColor: selectedClientId === client.id ? undefined : "var(--color-border)" }}
                >
                  <p className="font-medium">{client.name}</p>
                  <p className="text-xs text-muted-foreground" dir="ltr">{client.phone}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="visit-date">تاريخ الزيارة</Label>
              <Input id="visit-date" type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="delivery-date">تاريخ التسليم</Label>
              <Input id="delivery-date" type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="return-date">تاريخ الإرجاع</Label>
              <Input id="return-date" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="mt-1.5" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>الموظف المسؤول</Label>
              <Select value={employee} onValueChange={setEmployee}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="اختر الموظف" /></SelectTrigger>
                <SelectContent>
                  {mockEmployees.map((emp) => (
                    <SelectItem key={emp} value={emp}>{emp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ملاحظات إضافية..." className="mt-1.5" rows={2} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Button variant="outline" asChild>
            <Link to="/orders">إلغاء</Link>
          </Button>
          <Button disabled={!canProceed} onClick={handleNext}>
            التالي: اختيار الأزياء
            <ArrowLeft className="h-4 w-4 mr-1.5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
