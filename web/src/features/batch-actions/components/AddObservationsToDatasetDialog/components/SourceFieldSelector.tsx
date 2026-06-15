import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import type { SourceField } from "../types";
import { useI18n } from "@/src/features/i18n/I18nProvider";

type SourceFieldSelectorProps = {
  value: SourceField;
  onChange: (field: SourceField) => void;
  disabled?: boolean;
};

export function SourceFieldSelector({
  value,
  onChange,
  disabled = false,
}: SourceFieldSelectorProps) {
  const { t } = useI18n();

  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as SourceField)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="input">{t("common.input")}</SelectItem>
        <SelectItem value="output">{t("common.output")}</SelectItem>
        <SelectItem value="metadata">{t("common.metadata")}</SelectItem>
      </SelectContent>
    </Select>
  );
}
