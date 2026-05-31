import { MockAsyncSelect } from "./MockAsyncSelect";
import { mockWorkshops } from "./_mock-select-data";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

export function WorkshopsSelect(props: Props) {
  return (
    <MockAsyncSelect
      {...props}
      options={mockWorkshops}
      placeholder={props.placeholder ?? "اختر الورشة..."}
    />
  );
}
