import { Link } from "react-router-dom";
import type { TailoringOrder } from "@/features/tailoring/types/tailoring.types";
import { statusMap, paymentStatusMap } from "@/features/tailoring/constants/tailoring.constants";
import { formatNumber } from "@/shared/lib/format/numbers";
import { cn } from "@/shared/utils/cn";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User } from "lucide-react";

interface TailoringOrderCardProps {
  order: TailoringOrder;
  compact?: boolean;
}

export function TailoringOrderCard({ order, compact = false }: TailoringOrderCardProps) {
  const statusCfg = statusMap[order.status];
  const paymentCfg = paymentStatusMap[order.payment_status];
  const isLate = order.status === "overdue";
  const isUrgent = order.priority === "urgent" || order.days_remaining === 0;

  const borderColor = isLate || isUrgent ? "#FCA5A5" : order.priority === "VIP" ? "#FCD34D" : "#BFDBFE";

  return (
    <Link
      to={`/tailoring/orders/${order.id}`}
      className={cn(
        "block rounded-xl bg-white border-2 p-3.5 transition-all hover:shadow-md hover:-translate-y-0.5",
        compact && "p-3",
      )}
      style={{ borderColor }}
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant={statusCfg.variant} className="text-[10px] px-2 py-0">{statusCfg.label}</Badge>
          {order.priority === "VIP" && (
            <Badge className="text-[10px] px-2 py-0 bg-amber-100 text-amber-700 border-0">VIP</Badge>
          )}
          {isUrgent && order.status !== "overdue" && (
            <Badge variant="destructive" className="text-[10px] px-2 py-0">عاجل</Badge>
          )}
        </div>
        <span className="text-xs font-black text-blue-600">#{order.order_number}</span>
      </div>

      <h4 className="font-bold text-sm leading-snug mb-0.5">{order.client_name}</h4>
      <p className="text-xs text-muted-foreground mb-2.5">{order.garment_name}</p>

      <div className="flex items-center gap-2 text-xs mb-2.5">
        <span className="w-3 h-3 rounded-full border shrink-0" style={{ background: order.fabric_color_hex ?? "#94A3B8" }} />
        <span className="text-muted-foreground truncate">{order.fabric_name}</span>
      </div>

      {order.days_remaining_label && (
        <div className={cn("flex items-center gap-1.5 text-xs mb-2.5", isLate || isUrgent ? "text-red-500 font-bold" : "text-muted-foreground")}>
          <CalendarDays className="w-3.5 h-3.5 shrink-0" />
          <span>{order.days_remaining_label}{order.due_date ? ` — ${order.due_date.slice(5).replace("-", "/")}` : ""}</span>
        </div>
      )}

      <div className="flex items-end justify-between gap-2 pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="w-3.5 h-3.5" />
          <span>{order.tailor_name ?? order.employee_name ?? "—"}</span>
        </div>
        <div className="text-left">
          <p className="text-sm font-black">{formatNumber(order.total_price)} ج.م</p>
          {order.remaining > 0 ? (
            <p className="text-[10px] text-red-500 font-medium">متبقي {formatNumber(order.remaining)}</p>
          ) : (
            <p className="text-[10px] text-green-600 font-medium">{paymentCfg.label}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
