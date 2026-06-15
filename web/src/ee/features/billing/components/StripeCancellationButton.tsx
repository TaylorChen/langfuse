import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { useBillingInformation } from "./useBillingInformation";
import { api } from "@/src/utils/api";
import { useState } from "react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export const StripeCancellationButton = ({
  orgId,
  variant,
  className,
}: {
  orgId: string | undefined;
  variant: "secondary" | "default";
  className?: string;
}) => {
  const { translateText } = useI18n();
  const { cancellation } = useBillingInformation();
  const [loading, setLoading] = useState(false);
  const [_opId, setOpId] = useState<string | null>(null);

  const cancelMutation = api.cloudBilling.cancelStripeSubscription.useMutation({
    onSuccess: () => {
      toast.success(
        translateText("Subscription will be cancelled at period end"),
      );
      setLoading(false);
      setOpId(null);
      setTimeout(() => window.location.reload(), 500);
    },
    onError: () => {
      setLoading(false);
      setOpId(null);
      toast.error(translateText("Failed to cancel subscription"));
    },
  });

  const reactivateMutation =
    api.cloudBilling.reactivateStripeSubscription.useMutation({
      onSuccess: () => {
        toast.success(translateText("Subscription reactivated"));
        setLoading(false);
        setOpId(null);
        setTimeout(() => window.location.reload(), 500);
      },
      onError: () => {
        setLoading(false);
        setOpId(null);
        toast.error(translateText("Failed to reactivate subscription"));
      },
    });

  if (!orgId) return null;

  const onReactivate = async () => {
    try {
      setLoading(true);
      // idempotency key for mutation operations with the stripe api
      let opId = _opId;
      if (!opId) {
        opId = nanoid();
        setOpId(opId);
      }
      await reactivateMutation.mutateAsync({ orgId, opId });
    } catch (_e) {
      toast.error(translateText("Failed to reactivate subscription"));
    }
  };

  const onCancel = async () => {
    try {
      setLoading(true);
      // idempotency key for mutation operations with the stripe api
      let opId = _opId;
      if (!opId) {
        opId = nanoid();
        setOpId(opId);
      }
      await cancelMutation.mutateAsync({ orgId, opId });
    } catch (_e) {
      toast.error(translateText("Failed to cancel subscription"));
    }
  };

  // Reactivate with confirm dialog
  if (cancellation?.isCancelled) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={variant}
            disabled={loading}
            title={translateText("Reactivate Subscription")}
            className={className}
          >
            {loading
              ? translateText("Working...")
              : translateText("Reactivate Subscription")}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg">
              {translateText("Confirm Reactivation: Keep Your Subscription")}
            </DialogTitle>
          </DialogHeader>
          <DialogBody className="text-sm">
            <p>
              {translateText(
                "Reactivating removes the scheduled cancellation. Your subscription will continue beyond the current billing period and renew until you cancel again.",
              )}
            </p>
            <p>
              {translateText(
                "Your features and usage billing remain unchanged. By confirming, you agree to future renewals and charges.",
              )}
            </p>
          </DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">{translateText("Cancel")}</Button>
            </DialogClose>
            <Button variant="default" onClick={onReactivate} disabled={loading}>
              {loading
                ? translateText("Reactivating...")
                : translateText("Confirm Reactivation")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Cancel with confirm dialog
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          disabled={loading}
          title={translateText("Cancel Subscription")}
        >
          {translateText("Cancel Subscription")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">
            {translateText("Confirm Cancellation")}
          </DialogTitle>
        </DialogHeader>
        <DialogBody className="text-sm">
          <p>
            {translateText(
              "Your subscription will not renew. You will retain access until the end of the current billing period.",
            )}
          </p>
          <p>
            {translateText(
              "Usage during the remainder of the period is still billed under your current plan. By confirming, you schedule the cancellation for period end. You can reactivate before that date if you change your mind.",
            )}
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">
              {translateText("Keep Subscription")}
            </Button>
          </DialogClose>
          <Button variant="destructive" onClick={onCancel} disabled={loading}>
            {loading
              ? translateText("Cancelling...")
              : translateText("Confirm Cancellation")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
