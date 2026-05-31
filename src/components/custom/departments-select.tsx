import { MockAsyncSelect } from "./MockAsyncSelect";
import { mockDepartments } from "./_mock-select-data";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

export function DepartmentsSelect(props: Props) {
  return (
    <MockAsyncSelect
      {...props}
      options={mockDepartments}
      placeholder={props.placeholder ?? "اختر القسم..."}
    />
  );
}
