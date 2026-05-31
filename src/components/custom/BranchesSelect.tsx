import { MockAsyncSelect } from "./MockAsyncSelect";
import { mockBranches } from "./_mock-select-data";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

export function BranchesSelect(props: Props) {
  return (
    <MockAsyncSelect
      {...props}
      options={mockBranches}
      placeholder={props.placeholder ?? "اختر الفرع..."}
    />
  );
}
