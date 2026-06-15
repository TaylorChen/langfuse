import { StringParam, useQueryParam } from "use-query-params";
import { NewPromptForm } from "@/src/features/prompts/components/NewPromptForm";
import useProjectIdFromURL from "@/src/hooks/useProjectIdFromURL";
import { api } from "@/src/utils/api";
import Page from "@/src/components/layouts/page";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export const NewPrompt = () => {
  const projectId = useProjectIdFromURL();
  const { t, translateText } = useI18n();
  const [initialPromptId] = useQueryParam("promptId", StringParam);

  const { data: initialPrompt, isLoading } = api.prompts.byId.useQuery(
    {
      projectId: projectId as string, // Typecast as query is enabled only when projectId is present
      id: initialPromptId ?? "",
    },
    {
      enabled: Boolean(initialPromptId && projectId),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  if (isLoading) {
    return <div className="p-3">{t("prompts.loading")}</div>;
  }

  const breadcrumb: { name: string; href?: string }[] = [
    {
      name: translateText("Prompts"),
      href: `/project/${projectId}/prompts/`,
    },
    {
      name: t("prompts.newPrompt"),
    },
  ];

  if (initialPrompt) {
    breadcrumb.pop();
    breadcrumb.push(
      {
        name: initialPrompt.name,
        href: `/project/${projectId}/prompts/${encodeURIComponent(initialPrompt.name)}`,
      },
      { name: t("prompts.newVersion") },
    );
  }

  return (
    <Page
      withPadding
      scrollable
      headerProps={{
        title: initialPrompt
          ? `${initialPrompt.name} - ${t("prompts.newVersion")}`
          : t("prompts.createNewPrompt"),
        help: {
          description: t("prompts.indexDescription"),
          href: "https://langfuse.com/docs/prompts",
        },
        breadcrumb: breadcrumb,
      }}
    >
      {initialPrompt ? (
        <p className="text-muted-foreground text-sm">
          {t("prompts.immutableNotice")}
        </p>
      ) : null}
      <div className="my-8">
        <NewPromptForm {...{ initialPrompt }} />
      </div>
    </Page>
  );
};
