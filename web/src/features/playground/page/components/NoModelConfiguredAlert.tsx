import { AlertCircle, Settings } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { useI18n } from "@/src/features/i18n/I18nProvider";

interface NoModelConfiguredAlertProps {
  projectId: string;
}

export function NoModelConfiguredAlert({
  projectId,
}: NoModelConfiguredAlertProps) {
  const { translateText } = useI18n();

  return (
    <div className="p-4">
      <Alert
        variant="default"
        className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20"
      >
        <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
        <AlertTitle className="text-yellow-800 dark:text-yellow-400">
          {translateText("No Model Configured")}
        </AlertTitle>
        <AlertDescription className="text-yellow-700 dark:text-yellow-500">
          {translateText(
            "To use the playground, you need to configure a model first. Go to",
          )}{" "}
          <Link
            href={`/project/${projectId}/settings/llm-connections`}
            className="font-medium underline underline-offset-4 hover:text-yellow-900 dark:hover:text-yellow-300"
          >
            <Settings className="inline h-3 w-3" />{" "}
            {translateText("LLM Connection Settings")}
          </Link>{" "}
          {translateText("to add an LLM API key and configure your models.")}
        </AlertDescription>
      </Alert>
    </div>
  );
}
