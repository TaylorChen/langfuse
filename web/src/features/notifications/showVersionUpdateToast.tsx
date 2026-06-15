import { Button } from "@/src/components/ui/button";
import { useI18n } from "@/src/features/i18n/I18nProvider";
import { toast } from "sonner";

const VersionUpdateToastContent = () => {
  const { translateText } = useI18n();

  return (
    <div className="flex justify-between">
      <div className="flex min-w-[300px] flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="text-foreground/70 m-0 text-sm leading-tight font-medium">
            {translateText(
              "We have released a new version of Langfuse. Please refresh your browser to get the latest update.",
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size={"sm"}
          className="text-foreground/50"
          onClick={() => {
            window.location.reload();
          }}
        >
          {translateText("Refresh page")}
        </Button>
      </div>
    </div>
  );
};

export const showVersionUpdateToast = () => {
  toast.custom(() => <VersionUpdateToastContent />, {
    duration: Infinity,
    style: {
      padding: "1rem",
      borderRadius: "0.5rem",
      border: "1px solid hsl(var(--border))",
      backgroundColor: "hsl(var(--border))",
    },
  });
};
