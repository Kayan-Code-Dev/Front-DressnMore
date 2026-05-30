import { Filter } from "lucide-react";
import { useSession } from "@/shared/lib/auth/session.store";

type DashboardHeaderProps = {
  periodLabel: string;
  showFilters: boolean;
  onToggleFilters: () => void;
};

const today = new Date().toLocaleDateString("ar-EG", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

function getUserName(user: unknown): string {
  if (user && typeof user === "object" && "name" in user && typeof user.name === "string") {
    return user.name;
  }
  return "المدير العام";
}

export function DashboardHeader({
  periodLabel,
  showFilters,
  onToggleFilters,
}: DashboardHeaderProps) {
  const user = useSession((state) => state.user);
  const displayName = getUserName(user);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
      <div>
        <h1
          className="text-[20px] font-black leading-tight"
          style={{ color: "var(--color-text-primary)" }}
        >
          مرحباً،&nbsp;
          <span style={{ color: "var(--color-accent)" }}>{displayName}</span>
        </h1>
        <p
          className="text-[12.5px] mt-0.5 font-medium"
          style={{ color: "var(--color-text-muted)" }}
        >
          {today} · {periodLabel}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onToggleFilters}
          className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-bold rounded-xl border cursor-pointer transition-colors whitespace-nowrap"
          style={{
            background: showFilters ? "#F4F7FB" : "white",
            borderColor: showFilters ? "var(--color-accent)" : "var(--color-border)",
            color: "var(--color-text-secondary)",
          }}
        >
          <Filter className="w-3.5 h-3.5" />
          الفلاتر
        </button>
      </div>
    </div>
  );
}
