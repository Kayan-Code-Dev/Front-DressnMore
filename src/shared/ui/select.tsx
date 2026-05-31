import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn("select", className)} {...props}>
        {children}
      </select>
    );
  }
);
