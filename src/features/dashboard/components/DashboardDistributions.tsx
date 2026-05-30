import { Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DashboardRecentOrder } from "@/features/dashboard/types/dashboard.types";
import { fmtAr } from "../utils/dashboard.utils";

type DashboardDistributionsProps = {
  orders: DashboardRecentOrder[];
};

const typeLabels: Record<string, string> = {
  rent: "إيجار",
  sale: "بيع",
  tailoring: "تفصيل",
};

const statusVariant: Record<string, "success" | "info" | "secondary" | "destructive"> = {
  draft: "secondary",
  open: "info",
  paid: "success",
  cancelled: "destructive",
};

const statusLabels: Record<string, string> = {
  draft: "مسودة",
  open: "مفتوحة",
  paid: "مدفوعة",
  cancelled: "ملغاة",
};

export function DashboardDistributions({ orders }: DashboardDistributionsProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ background: "white", borderColor: "var(--color-border)", boxShadow: "var(--shadow-card)" }}
    >
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 flex items-center justify-center rounded-lg"
            style={{ background: "#F4F7FB", color: "var(--color-text-muted)" }}
          >
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="font-black text-sm" style={{ color: "var(--color-text-primary)" }}>
            آخر الطلبات
          </h3>
        </div>
        <Link
          to="/invoices"
          className="text-xs font-bold hover:underline"
          style={{ color: "var(--color-accent)" }}
        >
          عرض الكل
        </Link>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="sys-table-header">
              <TableHead className="text-center">رقم الفاتورة</TableHead>
              <TableHead className="text-center">العميل</TableHead>
              <TableHead className="text-center">النوع</TableHead>
              <TableHead className="text-center">الحالة</TableHead>
              <TableHead className="text-center">المبلغ</TableHead>
              <TableHead className="text-center">التاريخ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-sm text-muted-foreground">
                  لا توجد طلبات حديثة
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="sys-table-row">
                  <TableCell className="text-center font-semibold">{order.invoice_number}</TableCell>
                  <TableCell className="text-center">{order.customer_name}</TableCell>
                  <TableCell className="text-center">{typeLabels[order.type] ?? order.type}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={statusVariant[order.status] ?? "secondary"}>
                      {statusLabels[order.status] ?? order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-bold">{fmtAr(order.total)} ج.م</TableCell>
                  <TableCell className="text-center text-muted-foreground">{order.issued_on}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
