import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { MockAsyncSelect } from "./MockAsyncSelect";
import { mockClients } from "./_mock-select-data";
import useDebounce from "@/hooks/useDebounce";

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

export function ClientsSelect({
  value,
  onChange,
  disabled,
  placeholder = "اختر العميل",
  className,
}: Props) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce({ value: search, delay: 300 });

  const options = useMemo(() => {
    if (!debouncedSearch.trim()) return mockClients;
    const q = debouncedSearch.toLowerCase();
    return mockClients.filter((c) => c.name.toLowerCase().includes(q));
  }, [debouncedSearch]);

  return (
    <div className="space-y-2">
      <Input
        placeholder="ابحث عن عميل..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
      />
      <MockAsyncSelect
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={className}
        placeholder={placeholder}
        options={options}
      />
    </div>
  );
}
