import { MockAsyncSelect } from "./MockAsyncSelect";
import { mockRoles } from "./_mock-select-data";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

export function RolesSelect(props: Props) {
  return (
    <MockAsyncSelect
      {...props}
      options={mockRoles}
      placeholder={props.placeholder ?? "اختر الدور..."}
    />
  );
}
