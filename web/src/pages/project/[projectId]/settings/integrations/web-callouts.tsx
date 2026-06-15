import { ErrorPage } from "@/src/components/error-page";
import ContainerPage from "@/src/components/layouts/container-page";
import { useI18n } from "@/src/features/i18n/I18nProvider";
import { WebCalloutSettingsPage } from "@/src/features/web-callouts/components/WebCalloutSettingsPage";
import { api } from "@/src/utils/api";
import { useRouter } from "next/router";

export default function WebCalloutsSettings() {
  const { t } = useI18n();
  const router = useRouter();
  const projectId = router.query.projectId as string | undefined;
  const availability = api.webCallouts.availability.useQuery(
    { projectId: projectId ?? "" },
    { enabled: Boolean(projectId), staleTime: 60_000 },
  );

  if (!projectId || availability.isPending) {
    return null;
  }

  if (availability.data?.enabled !== true) {
    return (
      <ErrorPage
        title={t("common.pageNotFound")}
        message={t("common.pageDoesNotExist")}
      />
    );
  }

  return (
    <ContainerPage
      headerProps={{
        title: t("webCallouts.title"),
        breadcrumb: [
          {
            name: t("common.settings"),
            href: `/project/${projectId}/settings`,
          },
        ],
      }}
    >
      <WebCalloutSettingsPage projectId={projectId} />
    </ContainerPage>
  );
}
