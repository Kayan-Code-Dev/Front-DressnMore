import { useMemo } from "react";
import type { TailoringOrder, TailoringStage } from "@/features/tailoring/types/tailoring.types";
import { KANBAN_STAGES, stageMap } from "@/features/tailoring/constants/tailoring.constants";
import { formatNumber } from "@/shared/lib/format/numbers";
import { TailoringOrderCard } from "./tailoring-order-card";
import {
  FilePlus2,
  ShoppingBag,
  Scissors,
  Sparkles,
  Star,
} from "lucide-react";

const stageIcons: Partial<Record<TailoringStage, React.ComponentType<{ className?: string }>>> = {
  new_order: FilePlus2,
  fabric_receipt: ShoppingBag,
  cutting: Scissors,
  sewing: Sparkles,
  finishing: Star,
};

interface TailoringKanbanBoardProps {
  orders: TailoringOrder[];
}

export function TailoringKanbanBoard({ orders }: TailoringKanbanBoardProps) {
  const grouped = useMemo(() => {
    const map: Record<string, TailoringOrder[]> = {};
    for (const stage of KANBAN_STAGES) map[stage.key] = [];
    for (const order of orders) {
      if (order.status === "cancelled" || order.status === "completed") continue;
      const key = KANBAN_STAGES.some((s) => s.key === order.current_stage)
        ? order.current_stage
        : "new_order";
      map[key]?.push(order);
    }
    return map;
  }, [orders]);

  return (
    <div className="overflow-x-auto pb-2 -mx-1 px-1">
      <div className="flex gap-4 min-w-max">
        {KANBAN_STAGES.map((stage) => {
          const columnOrders = grouped[stage.key] ?? [];
          const columnTotal = columnOrders.reduce((s, o) => s + o.total_price, 0);
          const Icon = stageIcons[stage.key] ?? Scissors;

          return (
            <div key={stage.key} className="w-[280px] shrink-0">
              <div
                className="rounded-xl px-3 py-2.5 mb-3 flex items-center justify-between gap-2"
                style={{ background: stage.bg, border: `1px solid ${stage.color}22` }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${stage.color}22`, color: stage.color }}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{stage.label}</p>
                    <p className="text-[10px] text-muted-foreground">{formatNumber(columnTotal)} ج.م</p>
                  </div>
                </div>
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                  style={{ background: stage.color }}
                >
                  {columnOrders.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[120px]">
                {columnOrders.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground" style={{ borderColor: `${stage.color}44` }}>
                    لا توجد أوامر
                  </div>
                ) : (
                  columnOrders.map((order) => <TailoringOrderCard key={order.id} order={order} />)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { stageMap };
