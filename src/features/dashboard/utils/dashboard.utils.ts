import { formatInteger, formatNumber } from "@/shared/lib/format/numbers";

export function fmtAr(n: number | null | undefined): string {
  if (n == null) return "0";
  return formatInteger(n);
}

export function fmtNum(value: number | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return formatNumber(Number(value));
}

export function fmtCur(value: number | undefined | null, suffix = "ج.م"): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return `${formatNumber(Number(value))} ${suffix}`;
}

export function fmtPct(value: number | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return `${Number(value).toFixed(1)}%`;
}

export function fmtCompact(value: number | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "0";
  const n = Number(value);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return formatInteger(n);
}
