import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/src/components/ui/alert";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export const SupportOrUpgradePage = () => {
  const { translateText } = useI18n();

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{translateText("Access Restricted")}</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              {translateText("This feature requires additional permissions")}
            </p>
            <p>
              {translateText(
                "Contact your system/project administrator for access or upgrade your plan. Need help? Reach out to support.",
              )}
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};
