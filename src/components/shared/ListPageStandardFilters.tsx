import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/custom/DatePicker";
import { ListFiltersPanel } from "@/components/shared/ListFiltersPanel";

type ListPageStandardFiltersProps = {
  open: boolean;
  statusOptions?: Array<{ value: string; label: string }>;
};

const defaultStatusOptions = [
  { value: "all", label: "كل الحالات" },
  { value: "active", label: "نشط" },
  { value: "inactive", label: "غير نشط" },
];

export function ListPageStandardFilters({
  open,
  statusOptions = defaultStatusOptions,
}: ListPageStandardFiltersProps) {
  return (
    <ListFiltersPanel open={open}>
      <div className="space-y-2">
        <Label className="text-xs font-bold">الحالة</Label>
        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="كل الحالات" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold">من تاريخ</Label>
        <DatePicker placeholder="تاريخ البداية" onChange={() => undefined} />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold">إلى تاريخ</Label>
        <DatePicker placeholder="تاريخ النهاية" onChange={() => undefined} />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold">الفرع</Label>
        <Select defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="كل الفروع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الفروع</SelectItem>
            <SelectItem value="1">الفرع الرئيسي</SelectItem>
            <SelectItem value="2">فرع مدينة نصر</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </ListFiltersPanel>
  );
}
