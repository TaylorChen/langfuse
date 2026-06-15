import Spinner from "@/src/components/design-system/Spinner/Spinner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/card";
import { useI18n } from "@/src/features/i18n/I18nProvider";
import { cn } from "@/src/utils/tailwind";
import { type ReactNode } from "react";

export type DashboardCardProps = {
  className?: string;
  title: ReactNode;
  description?: ReactNode;
  isLoading: boolean;
  children?: ReactNode;
  headerChildren?: ReactNode;
  cardContentClassName?: string;
  headerClassName?: string;
  headerRight?: ReactNode;
};

export const DashboardCard = ({
  className,
  title,
  description,
  isLoading,
  children,
  headerChildren,
  cardContentClassName,
  headerClassName,
  headerRight,
}: DashboardCardProps) => {
  const { translateText } = useI18n();
  const translatedTitle =
    typeof title === "string" ? translateText(title) : title;
  const translatedDescription =
    typeof description === "string" ? translateText(description) : description;

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className={cn("relative", headerClassName)}>
        <div className="items-top flex justify-between">
          <div className="flex flex-col gap-1.5">
            <CardTitle>{translatedTitle}</CardTitle>
            {translatedDescription ? (
              <CardDescription>{translatedDescription}</CardDescription>
            ) : undefined}
          </div>
          {headerRight}
        </div>
        {headerChildren}
        {isLoading ? (
          <div className="absolute top-5 right-5">
            <Spinner size="md" />
          </div>
        ) : null}
      </CardHeader>
      <CardContent
        className={cn("flex flex-1 flex-col gap-4", cardContentClassName)}
      >
        {children}
      </CardContent>
    </Card>
  );
};
