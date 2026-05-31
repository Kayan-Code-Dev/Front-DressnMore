import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BranchesSelect } from "./BranchesSelect";
import { FactoriesSelect } from "./FactoriesSelect";
import { WorkshopsSelect } from "./WorkshopsSelect";
import type { TEntity } from "@/lib/types/entity.types";

type StandaloneProps = {
  entityType?: TEntity;
  entityId?: string;
  onEntityTypeChange?: (value: TEntity | undefined) => void;
  onEntityIdChange?: (value: string) => void;
  disabled?: boolean;
  entityTypeLabel?: string;
  entityIdLabel?: string;
  className?: string;
};

const ENTITY_OPTIONS: { value: TEntity; label: string }[] = [
  { value: "branch", label: "فرع" },
  { value: "factory", label: "مصنع" },
  { value: "workshop", label: "ورشة" },
];

export function EntitySelect(props: StandaloneProps) {
  const {
    entityType,
    entityId = "",
    onEntityTypeChange,
    onEntityIdChange,
    disabled,
    entityTypeLabel = "نوع المكان",
    entityIdLabel = "المكان",
    className = "",
  } = props;

  return (
    <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      <div className="space-y-2">
        <label className="text-xs font-bold">{entityTypeLabel}</label>
        <Select
          value={entityType ?? ""}
          onValueChange={(v) => onEntityTypeChange?.(v as TEntity)}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر النوع..." />
          </SelectTrigger>
          <SelectContent>
            {ENTITY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold">{entityIdLabel}</label>
        {entityType === "branch" && (
          <BranchesSelect value={entityId} onChange={(v) => onEntityIdChange?.(v)} disabled={disabled} />
        )}
        {entityType === "factory" && (
          <FactoriesSelect value={entityId} onChange={(v) => onEntityIdChange?.(v)} disabled={disabled} />
        )}
        {entityType === "workshop" && (
          <WorkshopsSelect value={entityId} onChange={(v) => onEntityIdChange?.(v)} disabled={disabled} />
        )}
        {!entityType && (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder="اختر النوع أولاً" />
            </SelectTrigger>
          </Select>
        )}
      </div>
    </div>
  );
}
