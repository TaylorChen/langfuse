import { showSuccessToast } from "@/src/features/notifications/showSuccessToast";
import { api } from "@/src/utils/api";
import { copyTextToClipboard } from "@/src/utils/clipboard";
import { useI18n } from "@/src/features/i18n/I18nProvider";

type UseViewMutationsProps = {
  handleSetViewId: (viewId: string | null) => void;
};

export const useViewMutations = ({
  handleSetViewId,
}: UseViewMutationsProps) => {
  const utils = api.useUtils();
  const { translateText } = useI18n();

  const createMutation = api.TableViewPresets.create.useMutation({
    onSuccess: (data) => {
      utils.TableViewPresets.getByTableName.invalidate();
      handleSetViewId(data.view.id);
    },
  });

  const updateConfigMutation = api.TableViewPresets.update.useMutation({
    onSuccess: (data) => {
      utils.TableViewPresets.getById.invalidate({
        viewId: data.view.id,
      });
      utils.TableViewPresets.getByTableName.invalidate();
      showSuccessToast({
        title: translateText("View updated"),
        description: translateText(
          "{viewName} has been updated to reflect your current table state",
          { viewName: data.view.name },
        ),
      });
    },
  });

  const updateNameMutation = api.TableViewPresets.updateName.useMutation({
    onSuccess: () => {
      utils.TableViewPresets.getByTableName.invalidate();
    },
  });

  const deleteMutation = api.TableViewPresets.delete.useMutation({
    onSuccess: () => {
      utils.TableViewPresets.getByTableName.invalidate();
      handleSetViewId(null);
    },
  });

  const generatePermalinkMutation =
    api.TableViewPresets.generatePermalink.useMutation({
      onSuccess: (data) => {
        copyTextToClipboard(data);
        showSuccessToast({
          title: translateText("Permalink copied to clipboard"),
          description: translateText(
            "You can now share the permalink with others",
          ),
        });
      },
    });

  return {
    createMutation,
    updateConfigMutation,
    updateNameMutation,
    deleteMutation,
    generatePermalinkMutation,
  };
};
