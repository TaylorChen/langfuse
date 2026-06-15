import type { ReactNode } from "react";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export const ExperimentOverviewSectionHeading = ({
  children,
}: {
  children: ReactNode;
}) => <h4 className="mb-2 text-sm font-medium">{children}</h4>;

export const ExperimentOverviewField = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => {
  const { translateText } = useI18n();

  return (
    <div>
      <div className="text-muted-foreground text-xs">
        {translateText(label)}
      </div>
      {children}
    </div>
  );
};
