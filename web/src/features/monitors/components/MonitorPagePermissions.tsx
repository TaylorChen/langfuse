import { type ReactNode } from "react";

import { ErrorPage } from "@/src/components/error-page";
import { SupportOrUpgradePage } from "@/src/ee/features/billing/components/SupportOrUpgradePage";
import { useLangfuseCloudRegion } from "@/src/features/organizations/hooks";
import { useHasProjectAccess } from "@/src/features/rbac/utils/checkProjectAccess";
import useProjectIdFromURL from "@/src/hooks/useProjectIdFromURL";
import { useI18n } from "@/src/features/i18n/I18nProvider";

/** MonitorScope is the RBAC scope a monitor page can require for entry. */
type MonitorScope = "monitors:read" | "monitors:CUD";

/** MonitorPagePermissions gates a monitor page on Langfuse Cloud and a project RBAC scope. */
export function MonitorPagePermissions({
  scope,
  children,
}: {
  scope: MonitorScope;
  children: ReactNode;
}) {
  const { t } = useI18n();
  const projectId = useProjectIdFromURL();
  const { isLangfuseCloud } = useLangfuseCloudRegion();
  const hasAccess = useHasProjectAccess({ projectId, scope });

  if (!isLangfuseCloud) {
    return (
      <ErrorPage
        title={t("common.notFound")}
        message={t("common.pageDoesNotExist")}
      />
    );
  }

  if (!hasAccess) {
    return <SupportOrUpgradePage />;
  }

  return <>{children}</>;
}
