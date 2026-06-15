import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { type ObjectType } from "@/src/features/score-analytics/lib/analytics-url-state";
import { useI18n } from "@/src/features/i18n/I18nProvider";

const OBJECT_TYPE_OPTIONS: Array<{ value: ObjectType; label: string }> = [
  { value: "all", label: "All Objects" },
  { value: "trace", label: "Traces" },
  { value: "session", label: "Sessions" },
  { value: "observation", label: "Observations" },
  { value: "dataset_run", label: "Dataset Runs" },
];

interface ObjectTypeFilterProps {
  value: ObjectType;
  onChange: (value: ObjectType) => void;
  className?: string;
}

export function ObjectTypeFilter({
  value,
  onChange,
  className,
}: ObjectTypeFilterProps) {
  const { translateText } = useI18n();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={className}
        aria-label={translateText("Object type")}
      >
        <SelectValue placeholder={translateText("Object type")} />
      </SelectTrigger>
      <SelectContent>
        {OBJECT_TYPE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {translateText(option.label)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
