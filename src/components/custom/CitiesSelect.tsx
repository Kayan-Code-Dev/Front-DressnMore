import { MockAsyncSelect } from "./MockAsyncSelect";
import { mockCities } from "./_mock-select-data";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

export function CitiesSelect(props: Props) {
  return (
    <MockAsyncSelect
      {...props}
      options={mockCities}
      placeholder={props.placeholder ?? "اختر المدينة..."}
    />
  );
}

export function CitiesSelectByModule(props: Props) {
  return <CitiesSelect {...props} />;
}
