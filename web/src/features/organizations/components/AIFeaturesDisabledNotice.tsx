import { type ReactNode } from "react";
import { ExternalLink } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { useHasOrganizationAccess } from "@/src/features/rbac/utils/checkOrganizationAccess";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export function openAIFeaturesSettings(organizationId: string) {
  window.open(
    `/organization/${organizationId}/settings`,
    "_blank",
    "noopener,noreferrer",
  );
}

export function AIFeaturesDisabledNotice({
  organizationId,
  children,
}: {
  organizationId: string | undefined;
  children: ReactNode;
}) {
  const { translateText } = useI18n();
  const canUpdateOrgSettings = useHasOrganizationAccess({
    organizationId,
    scope: "organization:update",
  });

  return (
    <div className="flex flex-col gap-3">
      <p className="text-muted-foreground text-sm">
        {children}
        {!canUpdateOrgSettings
          ? ` ${translateText("Ask your organization administrator to enable AI features in organization settings.")}`
          : null}
      </p>
      {canUpdateOrgSettings && organizationId ? (
        <Button
          onClick={() => openAIFeaturesSettings(organizationId)}
          variant="outline"
          size="sm"
          className="w-fit"
        >
          {translateText("Enable in Organization Settings")}
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}
