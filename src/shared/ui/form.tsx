import type { PropsWithChildren } from "react";
import { cn } from "@/shared/utils/cn";

type FormFieldProps = PropsWithChildren<{
  label: string;
  htmlFor: string;
  className?: string;
  hint?: string;
  error?: string | null;
}>;

export function FormField({ label, htmlFor, className, hint, error, children }: FormFieldProps) {
  return (
    <label htmlFor={htmlFor} className={cn("form-field", className)}>
      <span className="form-label">{label}</span>
      {children}
      {error ? <small className="form-error">{error}</small> : null}
      {hint && !error ? <small className="form-hint">{hint}</small> : null}
    </label>
  );
}
