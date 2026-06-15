import React from "react";
import {
  SplashScreen,
  type ValueProposition,
} from "@/src/components/ui/splash-screen";
import { FileText, GitBranch, Zap, BarChart4 } from "lucide-react";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export function PromptsOnboarding({ projectId }: { projectId: string }) {
  const { translateText } = useI18n();
  const valuePropositions: ValueProposition[] = [
    {
      title: translateText("Decoupled from code"),
      description: translateText(
        "Deploy new prompts without application redeployment, making updates faster and easier",
      ),
      icon: <FileText className="h-4 w-4" />,
    },
    {
      title: translateText("Edit in UI or programmatically"),
      description: translateText(
        "Non-technical users can easily edit prompts in the UI. Developers can optionally update prompts programmatically via the API and SDKs",
      ),
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      title: translateText("Performance optimized"),
      description: translateText(
        "Client-side caching prevents latency or availability issues for your applications",
      ),
      icon: <Zap className="h-4 w-4" />,
    },
    {
      title: translateText("Compare metrics"),
      description: translateText(
        "Track latency, cost, and evaluation metrics across different prompt versions",
      ),
      icon: <BarChart4 className="h-4 w-4" />,
    },
  ];

  return (
    <SplashScreen
      title={translateText("Get Started with Prompt Management")}
      description={translateText(
        "Langfuse Prompt Management helps you centrally manage, version control, and collaboratively iterate on your prompts. Start using prompt management to improve your LLM application's performance and maintainability.",
      )}
      valuePropositions={valuePropositions}
      primaryAction={{
        label: translateText("Create Prompt"),
        href: `/project/${projectId}/prompts/new`,
      }}
      secondaryAction={{
        label: translateText("Learn More"),
        href: "https://langfuse.com/docs/prompt-management/get-started",
      }}
    />
  );
}
