import { MockAsyncSelect } from "./MockAsyncSelect";
import { mockJobTitles } from "./_mock-select-data";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

export function JobTitlesSelect(props: Props) {
  return (
    <MockAsyncSelect
      {...props}
      options={mockJobTitles}
      placeholder={props.placeholder ?? "اختر المسمى الوظيفي..."}
    />
  );
}
