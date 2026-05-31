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
    <div className="rounded-xl border bg-white p-4 sm:p-5 shadow-sm overflow-x-hidden" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <h3 className="font-bold text-base">تتبع مراحل الإنتاج</h3>
        <div className="flex items-center gap-2 w-full sm:w-auto sm:min-w-[140px]">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-bold text-muted-foreground shrink-0">{progress}% مكتمل</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-2">
        {TAILORING_STAGES.map((stage, idx) => {
          const Icon = stageIcons[stage.key];
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isLocked = idx > currentIdx + 1;

          return (
            <div key={stage.key} className="flex flex-col items-center text-center min-w-0">
              <div
                className={cn(
                  "w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border-2 transition-all",
                  isCurrent && "ring-4 ring-blue-100 scale-105",
                  isDone && "bg-green-500 border-green-500 text-white",
                  isCurrent && "bg-white border-blue-500 text-blue-600",
                  !isDone && !isCurrent && "bg-muted/40 border-muted text-muted-foreground",
                )}
              >
                {isLocked ? <Lock className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <p className={cn("text-[10px] font-medium mt-2 leading-tight px-0.5 line-clamp-2", isCurrent && "text-blue-600 font-bold")}>
                {stage.shortLabel}
              </p>
              {isCurrent && (
                <span className="mt-1 text-[10px] font-black text-white bg-blue-500 px-2 py-0.5 rounded-full">الآن</span>
              )}
              {idx < TAILORING_STAGES.length - 1 && (
                <div className={cn("hidden lg:block absolute")} />
              )}
            </div>
          );
        })}
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
