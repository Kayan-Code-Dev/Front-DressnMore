import { MockAsyncSelect } from "./MockAsyncSelect";
import { mockCountries } from "./_mock-select-data";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

export function CountriesSelectByModule(props: Props) {
  return (
    <MockAsyncSelect
      {...props}
      options={mockCountries}
      placeholder={props.placeholder ?? "اختر الدولة..."}
    />
  );
}
