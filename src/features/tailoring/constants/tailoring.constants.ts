import type { TailoringOrderStatus, TailoringPriority, TailoringStage } from "@/features/tailoring/types/tailoring.types";

export const TAILORING_STAGES: {
  key: TailoringStage;
  label: string;
  shortLabel: string;
  color: string;
  bg: string;
  kanban?: boolean;
}[] = [
  { key: "new_order", label: "طلب جديد", shortLabel: "طلب جديد", color: "#3B82F6", bg: "#EFF6FF", kanban: true },
  { key: "fabric_receipt", label: "استلام القماش", shortLabel: "استلام القماش", color: "#EAB308", bg: "#FEFCE8", kanban: true },
  { key: "cutting", label: "القص والتحضير", shortLabel: "القص", color: "#8B5CF6", bg: "#F5F3FF", kanban: true },
  { key: "sewing", label: "الخياطة", shortLabel: "الخياطة", color: "#0EA5E9", bg: "#F0F9FF", kanban: true },
  { key: "finishing", label: "التشطيب والتطريز", shortLabel: "التشطيب", color: "#EC4899", bg: "#FDF2F8", kanban: true },
  { key: "quality_review", label: "مراجعة الجودة", shortLabel: "الجودة", color: "#14B8A6", bg: "#F0FDFA", kanban: false },
  { key: "ready_for_delivery", label: "جاهز للتسليم", shortLabel: "جاهز", color: "#F97316", bg: "#FFF7ED", kanban: false },
  { key: "delivered", label: "تم التسليم", shortLabel: "تم التسليم", color: "#22C55E", bg: "#F0FDF4", kanban: false },
];

export const KANBAN_STAGES = TAILORING_STAGES.filter((s) => s.kanban);

export const stageMap = Object.fromEntries(TAILORING_STAGES.map((s) => [s.key, s])) as Record<
  TailoringStage,
  (typeof TAILORING_STAGES)[number]
>;

export const statusMap: Record<
  TailoringOrderStatus,
  { label: string; variant: "success" | "warning" | "destructive" | "info" | "secondary"; color: string }
> = {
  active: { label: "نشط", variant: "success", color: "#3B82F6" },
  completed: { label: "منجز", variant: "info", color: "#22C55E" },
  overdue: { label: "متأخر", variant: "destructive", color: "#EF4444" },
  cancelled: { label: "ملغي", variant: "warning", color: "#94A3B8" },
};

export const priorityMap: Record<
  TailoringPriority,
  { label: string; variant: "info" | "destructive" | "secondary"; color: string }
> = {
  VIP: { label: "VIP", variant: "info", color: "#F59E0B" },
  urgent: { label: "عاجل", variant: "destructive", color: "#EF4444" },
  normal: { label: "عادي", variant: "secondary", color: "#64748B" },
};

export const paymentStatusMap: Record<
  string,
  { label: string; variant: "success" | "warning" | "destructive" | "secondary"; color: string }
> = {
  paid: { label: "مدفوع", variant: "success", color: "#22C55E" },
  partial: { label: "مدفوع جزئياً", variant: "warning", color: "#F59E0B" },
  unpaid: { label: "غير مدفوع", variant: "destructive", color: "#EF4444" },
};

export function stageIndex(stage: TailoringStage): number {
  return TAILORING_STAGES.findIndex((s) => s.key === stage);
}

export function nextStage(stage: TailoringStage): TailoringStage | null {
  const idx = stageIndex(stage);
  if (idx < 0 || idx >= TAILORING_STAGES.length - 1) return null;
  return TAILORING_STAGES[idx + 1].key;
}
