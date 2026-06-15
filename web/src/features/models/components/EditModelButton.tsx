import { Button } from "@/src/components/ui/button";
import { useHasProjectAccess } from "@/src/features/rbac/utils/checkProjectAccess";
import { UpsertModelFormDialog } from "@/src/features/models/components/UpsertModelFormDialog";
import { type GetModelResult } from "@/src/features/models/validation";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export const EditModelButton = ({
  modelData,
  projectId,
}: {
  modelData: GetModelResult;
  projectId: string;
}) => {
  const { translateText } = useI18n();
  const hasAccess = useHasProjectAccess({
    projectId,
    scope: "models:CUD",
  });

  return (
    <UpsertModelFormDialog {...{ modelData, projectId, action: "edit" }}>
      <Button
        variant="outline"
        disabled={!hasAccess}
        title={translateText("Edit model")}
        className="flex items-center"
      >
        <span>{translateText("Edit")}</span>
      </Button>
    </UpsertModelFormDialog>
  );
};
