import React from "react";
import { CodeView } from "@/src/components/ui/CodeJsonViewer";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export const WebhookSecretRender = ({
  webhookSecret,
}: {
  webhookSecret: string;
}) => {
  const { translateText } = useI18n();

  return (
    <>
      <div className="mb-4">
        <div className="text-md font-semibold">
          {translateText("Webhook Secret")}
        </div>
        <div className="my-2 text-sm">
          {translateText(
            "This secret can only be viewed once. You can regenerate it in the automation settings if needed. Use this secret to verify webhook signatures in your endpoint.",
          )}
        </div>
        <CodeView content={webhookSecret} defaultCollapsed={false} />
      </div>
    </>
  );
};
