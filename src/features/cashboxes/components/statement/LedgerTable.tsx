import type { LedgerEntry } from "@/features/cashboxes/types/statement.types";
import { OPENING_BALANCE } from "@/features/cashboxes/mocks/statement.mock";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/shared/lib/format/numbers";
import { ArrowDownLeft, ArrowUpRight, BookOpen, Flag } from "lucide-react";

interface LedgerTableProps {
  rows: LedgerEntry[];
  loading?: boolean;
  openingBalance?: number;
}

const statusLabel: Record<string, { label: string; className: string }> = {
  completed: { label: "مكتمل", className: "bg-emerald-50 text-emerald-700" },
  paid: { label: "مدفوع", className: "bg-emerald-50 text-emerald-700" },
  partial: { label: "جزئي", className: "bg-violet-50 text-violet-700" },
};

function formatArabicDate(value: string) {
  try {
    return new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "long", year: "numeric" }).format(
      new Date(value),
    );
  } catch {
    return value;
  }
}

function TableSkeleton({ cols = 10 }: { cols?: number }) {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((__, j) => (
            <TableCell key={j} className="text-center">
              <Skeleton className="h-5 w-full max-w-[90px] mx-auto" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function LedgerTable({ rows, loading, openingBalance = OPENING_BALANCE }: LedgerTableProps) {
  const totalCredit = rows.reduce((s, r) => s + (r.credit ?? 0), 0);
  const totalDebit = rows.reduce((s, r) => s + (r.debit ?? 0), 0);
  const endingBalance = openingBalance + totalCredit - totalDebit;

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-600" />
          <p className="font-bold text-sm">دفتر الأستاذ — كشف المعاملات</p>
        </div>
        <span className="text-xs text-muted-foreground">{rows.length} قيد</span>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#1a3a6d] hover:bg-[#1a3a6d]">
              <TableHead className="text-center text-white text-xs font-bold">التاريخ</TableHead>
              <TableHead className="text-center text-white text-xs font-bold">رقم المرجع</TableHead>
              <TableHead className="text-center text-white text-xs font-bold">البيان</TableHead>
              <TableHead className="text-center text-white text-xs font-bold">الفئة</TableHead>
              <TableHead className="text-center text-white text-xs font-bold">الفرع</TableHead>
              <TableHead className="text-center text-white text-xs font-bold">الطرف</TableHead>
              <TableHead className="text-center text-white text-xs font-bold">دائن (دخل)</TableHead>
              <TableHead className="text-center text-white text-xs font-bold">مدين (خروج)</TableHead>
              <TableHead className="text-center text-white text-xs font-bold">الرصيد المتراكم</TableHead>
              <TableHead className="text-center text-white text-xs font-bold">الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton />
            ) : (
              <>
                <TableRow className="bg-amber-50/80 hover:bg-amber-50/80">
                  <TableCell colSpan={6} className="text-center font-bold text-amber-800">
                    <span className="inline-flex items-center gap-1.5">
                      <Flag className="h-3.5 w-3.5" />
                      رصيد أول المدة (افتتاحي)
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">—</TableCell>
                  <TableCell className="text-center text-muted-foreground">—</TableCell>
                  <TableCell className="text-center font-black text-amber-700">
                    {formatNumber(openingBalance)} ج.م
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">—</TableCell>
                </TableRow>

                {rows.length > 0 ? (
                  rows.map((row) => {
                    const st = statusLabel[row.status] ?? statusLabel.completed;
                    return (
                      <TableRow key={row.id} className="even:bg-muted/15">
                        <TableCell className="text-center text-xs">{formatArabicDate(row.date)}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                              row.credit ? "text-emerald-700 bg-emerald-50" : "text-red-600 bg-red-50"
                            }`}
                          >
                            {row.reference}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center gap-1 text-xs max-w-[180px]">
                            {row.credit ? (
                              <ArrowDownLeft className="h-3 w-3 text-emerald-600 shrink-0" />
                            ) : (
                              <ArrowUpRight className="h-3 w-3 text-red-500 shrink-0" />
                            )}
                            <span className="truncate">{row.description}</span>
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">{row.category}</span>
                        </TableCell>
                        <TableCell className="text-center text-xs">{row.branch_name}</TableCell>
                        <TableCell className="text-center text-xs max-w-[120px] truncate">{row.party}</TableCell>
                        <TableCell className="text-center font-semibold text-emerald-600 text-sm">
                          {row.credit ? formatNumber(row.credit) : "—"}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-red-500 text-sm">
                          {row.debit ? formatNumber(row.debit) : "—"}
                        </TableCell>
                        <TableCell
                          className={`text-center font-bold text-sm ${
                            row.running_balance < 0 ? "text-red-600" : "text-blue-700"
                          }`}
                        >
                          {formatNumber(row.running_balance)} ج.م
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.className}`}>
                            {st.label}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="py-10 text-center text-muted-foreground">
                      لا توجد معاملات لعرضها.
                    </TableCell>
                  </TableRow>
                )}

                {rows.length > 0 && (
                  <TableRow className="bg-[#1a3a6d] hover:bg-[#1a3a6d] text-white">
                    <TableCell colSpan={6} className="text-center font-bold text-sm">
                      المجموع / الإجماليات ({rows.length} قيد)
                    </TableCell>
                    <TableCell className="text-center font-black text-emerald-300">
                      {formatNumber(totalCredit)} ج.م
                    </TableCell>
                    <TableCell className="text-center font-black text-red-300">
                      {formatNumber(totalDebit)} ج.م
                    </TableCell>
                    <TableCell className="text-center font-black">{formatNumber(endingBalance)} ج.م</TableCell>
                    <TableCell className="text-center">
                      <span className="text-[10px] font-bold bg-white/15 px-2 py-0.5 rounded">رصيد آخر المدة</span>
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
