import type { PropsWithChildren, TableHTMLAttributes, HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export function Table({ className, children, ...props }: PropsWithChildren<TableHTMLAttributes<HTMLTableElement>>) {
  return (
    <div className="table-wrapper">
      <table className={cn("table", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, ...props }: PropsWithChildren<HTMLAttributes<HTMLTableSectionElement>>) {
  return <thead className={cn(className)} {...props} />;
}

export function TableBody({ className, ...props }: PropsWithChildren<HTMLAttributes<HTMLTableSectionElement>>) {
  return <tbody className={cn(className)} {...props} />;
}

export function TableRow({ className, ...props }: PropsWithChildren<HTMLAttributes<HTMLTableRowElement>>) {
  return <tr className={cn(className)} {...props} />;
}

export function TableHead({ className, ...props }: PropsWithChildren<HTMLAttributes<HTMLTableCellElement>>) {
  return <th className={cn("table-head", className)} {...props} />;
}

export function TableCell({ className, ...props }: PropsWithChildren<HTMLAttributes<HTMLTableCellElement>>) {
  return <td className={cn("table-cell", className)} {...props} />;
}
