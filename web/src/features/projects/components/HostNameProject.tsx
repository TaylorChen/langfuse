import { Card } from "@/src/components/ui/card";
import { CodeView } from "@/src/components/ui/CodeJsonViewer";
import Header from "@/src/components/layouts/header";
import { useUiCustomization } from "@/src/ee/features/ui-customization/useUiCustomization";
import { env } from "@/src/env.mjs";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export function HostNameProject() {
  const { translateText } = useI18n();
  const uiCustomization = useUiCustomization();
  return (
    <div>
      <Header title={translateText("Host Name")} />
      <Card className="mb-4 p-3">
        <div className="">
          <div className="mb-2 text-sm">
            {translateText(
              "When connecting to Langfuse, use this hostname / baseurl.",
            )}
          </div>
          <CodeView
            content={`${uiCustomization?.hostname ?? window.origin}${env.NEXT_PUBLIC_BASE_PATH ?? ""}`}
          />
        </div>
      </Card>
    </div>
  );
}
