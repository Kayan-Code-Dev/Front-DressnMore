import { MockAsyncSelect } from "./MockAsyncSelect";
import { mockFactories } from "./_mock-select-data";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

export function FactoriesSelect(props: Props) {
  return (
    <MockAsyncSelect
      {...props}
      options={mockFactories}
      placeholder={props.placeholder ?? "اختر المصنع..."}
    />
  );
}
