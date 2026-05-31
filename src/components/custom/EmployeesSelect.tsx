import { MockAsyncSelect } from "./MockAsyncSelect";
import { mockEmployees } from "./_mock-select-data";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

export function EmployeesSelect(props: Props) {
  return (
    <MockAsyncSelect
      {...props}
      options={mockEmployees}
      placeholder={props.placeholder ?? "اختر الموظف..."}
    />
  );
}
