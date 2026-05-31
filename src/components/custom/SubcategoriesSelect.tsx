import { useMemo } from "react";
import { MockAsyncSelect } from "./MockAsyncSelect";
import { mockSubcategories } from "./_mock-select-data";

type Props = {
  value: string;
  onChange: (value: string) => void;
  categoryId?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
};

export function SubcategoriesSelect({ categoryId, ...props }: Props) {
  const options = useMemo(
    () =>
      categoryId
        ? mockSubcategories.filter((s) => s.category_id === categoryId)
        : mockSubcategories,
    [categoryId],
  );

  return (
    <MockAsyncSelect
      {...props}
      options={options}
      placeholder={props.placeholder ?? "اختر القسم الفرعي..."}
    />
  );
}
