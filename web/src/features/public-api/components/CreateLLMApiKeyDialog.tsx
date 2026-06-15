import { PlusIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { useHasProjectAccess } from "@/src/features/rbac/utils/checkProjectAccess";
import useProjectIdFromURL from "@/src/hooks/useProjectIdFromURL";
import { useUiCustomization } from "@/src/ee/features/ui-customization/useUiCustomization";
import { CreateLLMApiKeyForm } from "@/src/features/public-api/components/CreateLLMApiKeyForm";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export function CreateLLMApiKeyDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const projectId = useProjectIdFromURL();
  const hasAccess = useHasProjectAccess({
    projectId,
    scope: "llmApiKeys:create",
  });
  const uiCustomization = useUiCustomization();
  const { translateText } = useI18n();

  if (!hasAccess) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary">
          <PlusIcon className="mr-1.5 -ml-0.5 h-5 w-5" aria-hidden="true" />
          {translateText("Add LLM Connection")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90%] min-w-[40vw] overflow-auto">
        <DialogHeader>
          <DialogTitle>{translateText("New LLM Connection")}</DialogTitle>
        </DialogHeader>
        {open && (
          <CreateLLMApiKeyForm
            projectId={projectId}
            onSuccess={() => setOpen(false)}
            customization={uiCustomization}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
