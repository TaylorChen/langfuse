import { Card } from "@/src/components/ui/card";
import { SearchXIcon } from "lucide-react";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export const ObjectNotFoundCard = ({
  type,
}: {
  type: "TRACE" | "OBSERVATION" | "SESSION";
}) => {
  const { translateText } = useI18n();
  const translatedType = translateText(type.toLowerCase());

  return (
    <Card className="flex h-full w-full items-center justify-center border-none p-6">
      <div className="text-center">
        <SearchXIcon className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
        <p className="text-muted-foreground text-sm capitalize">
          {translateText("{type} not found. Likely deleted.", {
            type: translatedType,
          })}
        </p>
      </div>
    </Card>
  );
};
