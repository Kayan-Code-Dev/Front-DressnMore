import type { ReactNode } from "react";

type ListFiltersPanelProps = {
  open: boolean;
  children: ReactNode;
};

export function ListFiltersPanel({ open, children }: ListFiltersPanelProps) {
  if (!open) return null;

  return (
    <div
      className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl border"
      style={{ background: "#F8FAFC", borderColor: "var(--color-border)" }}
    >
      {children}
    </div>
  );
}
