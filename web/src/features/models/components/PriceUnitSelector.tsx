import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { PriceUnit } from "@/src/features/models/validation";
import { usePriceUnitMultiplier } from "@/src/features/models/hooks/usePriceUnitMultiplier";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export const PriceUnitSelector = () => {
  const { priceUnit, setPriceUnit } = usePriceUnitMultiplier();
  const { t } = useI18n();
  const getUnitLabel = (unit: PriceUnit) =>
    unit === PriceUnit.PerUnit
      ? t("models.perUnit")
      : unit === PriceUnit.Per1KUnits
        ? t("models.per1KUnits")
        : t("models.per1MUnits");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <ChevronDownIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Select
          value={priceUnit}
          onValueChange={(value: PriceUnit) => setPriceUnit(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("models.selectUnit")} />
          </SelectTrigger>
          <SelectContent>
            {Object.values(PriceUnit).map((unit) => (
              <SelectItem key={unit} value={unit}>
                {getUnitLabel(unit)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
  );
};
