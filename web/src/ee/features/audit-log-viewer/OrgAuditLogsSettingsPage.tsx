import Header from "@/src/components/layouts/header";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { AuditLogsTable } from "@/src/ee/features/audit-log-viewer/AuditLogsTable";
import { useHasEntitlement } from "@/src/features/entitlements/hooks";
import { useI18n } from "@/src/features/i18n/I18nProvider";
import { useHasOrganizationAccess } from "@/src/features/rbac/utils/checkOrganizationAccess";

export function OrgAuditLogsSettingsPage(props: { orgId: string }) {
  const { translateText } = useI18n();
  const hasAccess = useHasOrganizationAccess({
    organizationId: props.orgId,
    scope: "auditLogs:read",
  });
  const hasEntitlement = useHasEntitlement("audit-logs");

  const body = !hasEntitlement ? (
    <p className="text-muted-foreground text-sm">
      {translateText(
        "Audit logs are an Enterprise feature. Upgrade your plan to track all changes made to your organization.",
      )}
    </p>
  ) : !hasAccess ? (
    <Alert>
      <AlertTitle>{translateText("Access Denied")}</AlertTitle>
      <AlertDescription>
        {translateText(
          "Contact your organization administrator to request access.",
        )}
      </AlertDescription>
    </Alert>
  ) : (
    <AuditLogsTable scope="organization" orgId={props.orgId} />
  );

  return (
    <>
      <Header title={translateText("Organization Audit Logs")} />
      <p className="text-muted-foreground mb-2 text-sm">
        {translateText(
          "Track who changed what in your organization and when. Monitor organization settings, project creation/deletion, and membership changes over time.",
        )}
      </p>
      {body}
    </>
  );
}
