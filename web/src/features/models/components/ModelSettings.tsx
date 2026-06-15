import Header from "@/src/components/layouts/header";
import ModelTable from "@/src/components/table/use-cases/models";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export function ModelsSettings(props: { projectId: string }) {
  const { t } = useI18n();

  return (
    <>
      <Header title={t("models.title")} />
      <p className="mb-2 text-sm">{t("models.description")}</p>
      <ModelTable projectId={props.projectId} />
    </>
  );
}
