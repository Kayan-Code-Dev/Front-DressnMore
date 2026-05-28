import type { PropsWithChildren, ReactNode } from "react";
import { Button } from "@/shared/ui/button";

type DialogProps = PropsWithChildren<{
  open: boolean;
  title: string;
  onClose: () => void;
  footer?: ReactNode;
}>;

export function Dialog({ open, title, onClose, footer, children }: DialogProps) {
  if (!open) return null;

  return (
    <div className="dialog-backdrop" role="dialog" aria-modal="true">
      <div className="dialog-content">
        <div className="dialog-header">
          <h3>{title}</h3>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="dialog-body">{children}</div>
        {footer ? <div className="dialog-footer">{footer}</div> : null}
      </div>
    </div>
  );
}
