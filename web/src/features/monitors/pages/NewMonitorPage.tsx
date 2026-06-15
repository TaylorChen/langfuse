import { useRouter } from "next/router";

import Page from "@/src/components/layouts/page";
import { MonitorForm } from "@/src/features/monitors/components/MonitorForm";
import { MonitorPagePermissions } from "@/src/features/monitors/components/MonitorPagePermissions";
import { useI18n } from "@/src/features/i18n/I18nProvider";

/** NewMonitorPage renders the create-monitor form for a project. */
export default function NewMonitorPage() {
  const { t } = useI18n();
  const router = useRouter();
  const projectId = router.query.projectId as string;

  return (
    <MonitorPagePermissions scope="monitors:CUD">
      <Page
        withPadding
        headerProps={{
          title: t("monitors.newMonitor"),
          breadcrumb: [
            {
              name: t("monitors.title"),
              href: `/project/${projectId}/monitors`,
            },
          ],
        }}
      >
        <MonitorForm projectId={projectId} />
      </Page>
    </MonitorPagePermissions>
  );
}
