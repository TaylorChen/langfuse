import { useState } from "react";

import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { type GetModelResult } from "@/src/features/models/validation";
import { usePostHogClientCapture } from "@/src/features/posthog-analytics/usePostHogClientCapture";
import { useHasProjectAccess } from "@/src/features/rbac/utils/checkProjectAccess";
import { api } from "@/src/utils/api";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export const DeleteModelButton = ({
  modelData,
  projectId,
  onSuccess,
}: {
  modelData: GetModelResult;
  projectId: string;
  onSuccess?: () => void;
}) => {
  const { translateText } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const utils = api.useUtils();
  const capture = usePostHogClientCapture();
  const mut = api.models.delete.useMutation({
    onSuccess: () => {
      utils.models.invalidate();
      onSuccess?.();
    },
  });

  const hasAccess = useHasProjectAccess({
    projectId,
    scope: "models:CUD",
  });

  return (
    <Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          title={translateText("Delete model")}
          disabled={!hasAccess}
          className="border-light-red flex items-center"
        >
          <span className="text-dark-red">{translateText("Delete")}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h2 className="text-md mb-3 font-semibold">
          {translateText("Please confirm")}
        </h2>
        <p className="mb-3 text-sm">
          {translateText(
            "This action permanently deletes this model definition.",
          )}
        </p>
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="destructive"
            loading={mut.isPending}
            onClick={() => {
              capture("models:delete_button_click");
              mut.mutateAsync({
                projectId,
                modelId: modelData.id,
              });

              setIsOpen(false);
            }}
          >
            {translateText("Delete Model")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
