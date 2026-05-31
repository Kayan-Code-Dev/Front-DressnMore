import { MockAsyncSelect } from "./MockAsyncSelect";
import { mockCustodyTypes } from "./_mock-select-data";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

export function EmployeeCustodyTypesSelect(props: Props) {
  return (
    <MockAsyncSelect
      {...props}
      options={mockCustodyTypes}
      placeholder={props.placeholder ?? "اختر نوع الضمان..."}
    />
  );
}
