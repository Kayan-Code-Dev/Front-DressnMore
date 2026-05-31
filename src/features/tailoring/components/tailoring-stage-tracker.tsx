import type { TailoringOrder, TailoringStage } from "@/features/tailoring/types/tailoring.types";
import { TAILORING_STAGES, nextStage, stageIndex } from "@/features/tailoring/constants/tailoring.constants";
import { cn } from "@/shared/utils/cn";
import {
  FilePlus2,
  ShoppingBag,
  Scissors,
  Sparkles,
  Star,
  ShieldCheck,
  Store,
  Handshake,
  Lock,
} from "lucide-react";

const stageIcons: Record<TailoringStage, React.ComponentType<{ className?: string }>> = {
  new_order: FilePlus2,
  fabric_receipt: ShoppingBag,
  cutting: Scissors,
  sewing: Sparkles,
  finishing: Star,
  quality_review: ShieldCheck,
  ready_for_delivery: Store,
  delivered: Handshake,
};

interface TailoringStageTrackerProps {
  order: TailoringOrder;
}

export function TailoringStageTracker({ order }: TailoringStageTrackerProps) {
  const currentIdx = stageIndex(order.current_stage);
  const progress = order.progress_percent ?? Math.round((currentIdx / Math.max(1, TAILORING_STAGES.length - 1)) * 100);

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <h3 className="font-bold text-base">تتبع مراحل الإنتاج</h3>
        <div className="flex items-center gap-2 min-w-[140px]">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-bold text-muted-foreground">{progress}% مكتمل</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex items-start min-w-max gap-0">
          {TAILORING_STAGES.map((stage, idx) => {
            const Icon = stageIcons[stage.key];
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const isLocked = idx > currentIdx + 1;

            return (
              <div key={stage.key} className="flex items-start">
                <div className="flex flex-col items-center w-[88px]">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all",
                      isCurrent && "ring-4 ring-blue-100 scale-105",
                      isDone && "bg-green-500 border-green-500 text-white",
                      isCurrent && "bg-white border-blue-500 text-blue-600",
                      !isDone && !isCurrent && "bg-muted/40 border-muted text-muted-foreground",
                    )}
                  >
                    {isLocked ? <Lock className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <p className={cn("text-[10px] font-medium text-center mt-2 leading-tight px-1", isCurrent && "text-blue-600 font-bold")}>
                    {stage.shortLabel}
                  </p>
                  {isCurrent && (
                    <span className="mt-1 text-[10px] font-black text-white bg-blue-500 px-2 py-0.5 rounded-full">الآن</span>
                  )}
                </div>
                {idx < TAILORING_STAGES.length - 1 && (
                  <div
                    className={cn("w-8 h-0.5 mt-5.5 border-t-2 border-dashed", isDone ? "border-green-400" : "border-muted")}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {nextStage(order.current_stage) && (
        <div className="mt-4 pt-4 border-t text-center" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-xs text-muted-foreground mb-1">المرحلة التالية</p>
          <p className="text-sm font-bold text-blue-600">
            {TAILORING_STAGES.find((s) => s.key === nextStage(order.current_stage))?.label}
          </p>
        </div>
      )}
    </div>
  );
}
