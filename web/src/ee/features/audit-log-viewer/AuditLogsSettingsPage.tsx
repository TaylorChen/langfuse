import Header from "@/src/components/layouts/header";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { AuditLogsTable } from "@/src/ee/features/audit-log-viewer/AuditLogsTable";
import { useHasEntitlement } from "@/src/features/entitlements/hooks";
import { useI18n } from "@/src/features/i18n/I18nProvider";
import { useHasProjectAccess } from "@/src/features/rbac/utils/checkProjectAccess";

export function AuditLogsSettingsPage(props: { projectId: string }) {
  const { translateText } = useI18n();
  const hasAccess = useHasProjectAccess({
    projectId: props.projectId,
    scope: "auditLogs:read",
  });
  const hasEntitlement = useHasEntitlement("audit-logs");

  const body = !hasEntitlement ? (
    <p className="text-muted-foreground text-sm">
      {translateText(
        "Audit logs are an Enterprise feature. Upgrade your plan to track all changes made to your project.",
      )}
    </p>
  ) : !hasAccess ? (
    <Alert>
      <AlertTitle>{translateText("Access Denied")}</AlertTitle>
      <AlertDescription>
        {translateText("Contact your project administrator to request access.")}
      </AlertDescription>
    </Alert>
  ) : (
    <AuditLogsTable scope="project" projectId={props.projectId} />
  );

  return (
    <>
      <Header title={translateText("Audit Logs")} />
      <p className="text-muted-foreground mb-2 text-sm">
        {translateText(
          "Track who changed what in your project and when. Monitor settings, configurations, and data changes over time. Reach out to the Langfuse team if you require more detailed/filtered audit logs.",
        )}
      </p>
      {body}
    </>
  );
}
