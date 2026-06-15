import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { api } from "@/src/utils/api";
import { usePostHogClientCapture } from "@/src/features/posthog-analytics/usePostHogClientCapture";
import { toast } from "sonner";
import { useI18n } from "@/src/features/i18n/I18nProvider";

interface DeleteSpendAlertDialogProps {
  orgId: string;
  alertId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteSpendAlertDialog({
  orgId,
  alertId,
  open,
  onOpenChange,
  onSuccess,
}: DeleteSpendAlertDialogProps) {
  const { translateText } = useI18n();
  const [isDeleting, setIsDeleting] = useState(false);
  const capture = usePostHogClientCapture();

  const deleteMutation = api.spendAlerts.deleteSpendAlert.useMutation();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync({
        orgId,
        id: alertId,
      });
      capture("spend_alert:deleted", {
        orgId,
        alertId,
      });
      toast.success(translateText("Spend alert deleted successfully"));
      onSuccess();
    } catch (error) {
      console.error("Failed to delete spend alert:", error);
      toast.error(
        translateText("Failed to delete spend alert. Please try again."),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{translateText("Delete Spend Alert")}</DialogTitle>
          <DialogDescription>
            {translateText(
              "Are you sure you want to delete this spend alert? This action cannot be undone and you will no longer receive notifications for this threshold.",
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
          >
            {translateText("Cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting
              ? translateText("Deleting...")
              : translateText("Delete Alert")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
