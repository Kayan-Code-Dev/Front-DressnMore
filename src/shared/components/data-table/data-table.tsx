import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { TableSkeleton } from "@/shared/components/loading/table-skeleton";

export type DataTableColumn<T> = {
  key: string;
  title: string;
  render?: (item: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  rowKey: (item: T, index: number) => string;
};

export function DataTable<T>({
  columns,
  rows,
  loading = false,
  emptyTitle = "No data",
  emptyDescription = "Nothing to display yet.",
  rowKey,
}: DataTableProps<T>) {
  if (loading) {
    return <TableSkeleton rows={6} columns={columns.length} />;
  }

  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.title}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={rowKey(row, rowIndex)}>
            {columns.map((column) => (
              <TableCell key={`${rowKey(row, rowIndex)}-${column.key}`}>
                {column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? "")}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
