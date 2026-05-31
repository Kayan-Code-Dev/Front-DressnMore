import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { mockBranches } from "./_mock-select-data";

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  className?: string;
};

export function MultiBranchesSelect({ value, onChange, disabled, className }: Props) {
  const [selected, setSelected] = useState<string[]>(value);

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((v) => v !== id)
      : [...selected, id];
    setSelected(next);
    onChange(next);
  };

  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      {mockBranches.map((branch) => (
        <div key={branch.id} className="flex items-center gap-2">
          <Checkbox
            id={`branch-${branch.id}`}
            checked={selected.includes(branch.id)}
            disabled={disabled}
            onCheckedChange={() => toggle(branch.id)}
          />
          <Label htmlFor={`branch-${branch.id}`} className="text-sm cursor-pointer">
            {branch.name}
          </Label>
        </div>
      ))}
    </div>
  );
}
