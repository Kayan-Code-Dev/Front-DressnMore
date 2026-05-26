import type { PropsWithChildren } from "react";
import { cn } from "@/shared/utils/cn";

type FormFieldProps = PropsWithChildren<{
  label: string;
  htmlFor: string;
  className?: string;
  hint?: string;
}>;

export function FormField({ label, htmlFor, className, hint, children }: FormFieldProps) {
  return (
    <label htmlFor={htmlFor} className={cn("form-field", className)}>
      <span className="form-label">{label}</span>
      {children}
      {hint ? <small className="form-hint">{hint}</small> : null}
    </label>
  );
}
