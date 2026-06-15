import { useI18n } from "@/src/features/i18n/I18nProvider";
import { cn } from "@/src/utils/tailwind";
import { type ReactNode } from "react";

export const TotalMetric = ({
  className,
  metric,
  description,
  children,
}: {
  className?: string;
  metric: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) => {
  const { translateText } = useI18n();
  const translatedDescription =
    typeof description === "string" ? translateText(description) : description;

  return (
    <div
      className={cn(
        "animate-in flex items-baseline justify-start space-x-2",
        className,
      )}
    >
      <div className="text-3xl font-bold">{metric}</div>
      <p className="text-muted-foreground text-sm">{translatedDescription}</p>
      {children}
    </div>
  );
};
