import { Card } from "@/src/components/ui/card";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export const NotFoundCard = ({
  itemType,
  singleLine = false,
}: {
  itemType: "trace" | "observation";
  singleLine?: boolean;
}) => {
  const { t } = useI18n();
  const description = t("datasets.traceOrObservationNotFound", { itemType });

  if (singleLine) {
    return (
      <Card className="flex h-full w-full items-center justify-start overflow-hidden rounded-sm px-2">
        <p
          className="text-muted-foreground truncate text-xs"
          title={description}
        >
          {description}
        </p>
      </Card>
    );
  }

  return (
    <Card className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-sm p-3">
      <h2 className="mb-1.5 text-sm font-semibold">{t("common.notFound")}</h2>
      <p className="text-muted-foreground max-w-xs text-center text-xs">
        {description}
      </p>
    </Card>
  );
};
