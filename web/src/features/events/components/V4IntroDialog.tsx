import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogBody,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export function V4IntroDialog({
  open,
  onConfirm,
  onDismiss,
}: {
  open: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  const { translateText } = useI18n();

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onDismiss()}>
      <DialogContent
        className="[&>div:last-child]:hidden"
        aria-label={translateText("Welcome to a faster Langfuse")}
      >
        <DialogBody>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/v4-beta-intro.jpg"
            alt={translateText(
              "Langfuse gets Faster — performance comparison showing 5x to 165x speedups",
            )}
            className="w-full rounded-md"
          />
          <ul className="flex flex-col gap-3">
            <li className="text-muted-foreground text-sm">
              <span className="text-foreground block font-medium">
                {translateText("Welcome to a faster Langfuse")}
              </span>{" "}
              {translateText(
                "We've rebuilt the data model around observations rather than traces, which means charts, filters, and APIs are dramatically faster.",
              )}
            </li>
            <li className="text-muted-foreground text-sm">
              <span className="text-foreground block font-medium">
                {translateText("New Observations table")}
              </span>{" "}
              {translateText(
                "Your traces are still here. The default view now shows all observations. To see a table with just your root traces, filter by",
              )}{" "}
              <span className="font-medium">
                {translateText("Is Root Observation → True")}
              </span>
              .
            </li>
            <li className="text-muted-foreground text-sm">
              <span className="text-foreground block font-medium">
                {translateText("New Saved Table Views")}
              </span>{" "}
              {translateText(
                "Save your table filters as an org-wide saved view so your whole team starts from the same place.",
              )}{" "}
              <a
                href="https://langfuse.com/faq/all/explore-observations-in-v4"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline"
              >
                {translateText("Best practices →")}
              </a>
            </li>
          </ul>
          <div className="mt-3 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm dark:border-yellow-700 dark:bg-yellow-950">
            <p className="text-yellow-900 dark:text-yellow-200">
              <span className="font-medium">
                {translateText("Want traces to appear live?")}
              </span>{" "}
              {translateText(
                "Upgrade your SDK to the latest version. Older SDKs still work but traces may take ~10 minutes to appear.",
              )}{" "}
              <a
                href="https://langfuse.com/docs/observability/sdk/upgrade-path"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline hover:no-underline"
              >
                {translateText("Upgrade guide →")}
              </a>
            </p>
          </div>
        </DialogBody>
        <DialogFooter className="items-center sm:justify-between">
          <a
            href="https://langfuse.com/docs/v4"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-sm font-medium hover:underline"
          >
            {translateText("Read the v4 docs →")}
          </a>
          <Button onClick={onConfirm}>{translateText("Understood →")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
