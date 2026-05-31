import { MockAsyncSelect } from "./MockAsyncSelect";
import { mockCategories } from "./_mock-select-data";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

export function CategoriesSelect(props: Props) {
  return (
    <MockAsyncSelect
      {...props}
      options={mockCategories}
      placeholder={props.placeholder ?? "اختر القسم..."}
    />
  );
}
