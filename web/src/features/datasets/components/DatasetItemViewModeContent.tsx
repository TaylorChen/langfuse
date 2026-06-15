import type { DatasetItemDomain } from "@langfuse/shared";
import {
  stringifyDatasetItemData,
  type DatasetSchema,
} from "../utils/datasetItemUtils";
import { DatasetItemFields } from "@/src/features/datasets/components/DatasetItemFields";
import { useI18n } from "@/src/features/i18n/I18nProvider";

type DatasetItemViewModeContentProps = {
  item: DatasetItemDomain | null;
  isLoading: boolean;
  dataset: DatasetSchema | null;
};

/**
 * Renders the latest version of a dataset item in view mode.
 * Handles loading and not-found states.
 */
export const DatasetItemViewModeContent = ({
  item,
  isLoading,
  dataset,
}: DatasetItemViewModeContentProps) => {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <div className="text-muted-foreground text-sm">{t("common.loading")}</div>
    );
  }

  if (item === null) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium">{t("datasets.itemNotFound")}</p>
          <p className="mt-2 text-sm">
            {t("datasets.itemNotFoundDescription")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <DatasetItemFields
      inputValue={stringifyDatasetItemData(item.input)}
      expectedOutputValue={stringifyDatasetItemData(item.expectedOutput)}
      metadataValue={stringifyDatasetItemData(item.metadata)}
      dataset={dataset}
      editable={false}
    />
  );
};
