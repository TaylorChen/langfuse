import React from "react";
import {
  SplashScreen,
  type ValueProposition,
} from "@/src/components/ui/splash-screen";
import { Bot, Gauge, Zap, BarChart4, Code2 } from "lucide-react";
import { useIsCodeEvalEnabled } from "@/src/features/evals/hooks/useIsCodeEvalEnabled";
import { EvalTemplateSourceCodeLanguage } from "@langfuse/shared";
import { useI18n } from "@/src/features/i18n/I18nProvider";

interface EvaluatorsOnboardingProps {
  projectId: string;
}

export function EvaluatorsOnboarding({ projectId }: EvaluatorsOnboardingProps) {
  const { translateText } = useI18n();
  const { enabled, supportedSourceCodeLanguages } = useIsCodeEvalEnabled();
  const codeEvaluatorLanguageDescription =
    supportedSourceCodeLanguages.includes(EvalTemplateSourceCodeLanguage.PYTHON)
      ? "TypeScript or Python"
      : "TypeScript";

  const llmAsJudgeValuePropositions: ValueProposition[] = [
    {
      title: translateText("Automate evaluations"),
      description: translateText(
        "Use LLM-as-a-judge to automatically evaluate your traces without manual review",
      ),
      icon: <Bot className="h-4 w-4" />,
    },
    {
      title: translateText("Measure quality"),
      description: translateText(
        "Create custom evaluation criteria to measure the quality of your LLM outputs",
      ),
      icon: <Gauge className="h-4 w-4" />,
    },
    {
      title: translateText("Scale efficiently"),
      description: translateText(
        "Evaluate thousands of traces automatically with customizable sampling rates",
      ),
      icon: <Zap className="h-4 w-4" />,
    },
    {
      title: translateText("Track performance"),
      description: translateText(
        "Monitor evaluation metrics over time to identify trends and improvements",
      ),
      icon: <BarChart4 className="h-4 w-4" />,
    },
  ];

  if (enabled) {
    const evaluatorTypes: ValueProposition[] = [
      {
        title: translateText("LLM-as-a-judge evaluators"),
        description: translateText(
          "Use an LLM to score outputs against natural-language criteria.",
        ),
        icon: <Bot className="h-4 w-4" />,
      },
      {
        title: translateText("Code evaluators"),
        description: translateText(
          "Write {language} logic for deterministic, custom scoring.",
          { language: codeEvaluatorLanguageDescription },
        ),
        icon: <Code2 className="h-4 w-4" />,
      },
    ];

    return (
      <SplashScreen
        title={translateText("Get started with evaluations")}
        description={translateText(
          "Use evaluators to score traces and observations automatically. Langfuse supports two evaluator types:",
        )}
        valuePropositions={evaluatorTypes}
        primaryAction={{
          label: translateText("Create Evaluator"),
          href: `/project/${projectId}/evals/new`,
        }}
        secondaryAction={{
          label: translateText("Learn More"),
          href: "https://langfuse.com/docs/evaluation",
        }}
      />
    );
  }

  return (
    <SplashScreen
      title={translateText("Get Started with LLM-as-a-Judge Evaluations")}
      description={translateText(
        "Create evaluation templates and evaluators to automatically score your traces with LLM-as-a-judge. Set up custom evaluation criteria and let AI help you measure the quality of your outputs.",
      )}
      valuePropositions={llmAsJudgeValuePropositions}
      primaryAction={{
        label: translateText("Create Evaluator"),
        href: `/project/${projectId}/evals/new`,
      }}
      secondaryAction={{
        label: translateText("Learn More"),
        href: "https://langfuse.com/docs/evaluation/evaluation-methods/llm-as-a-judge",
      }}
      videoSrc="https://static.langfuse.com/prod-assets/onboarding/scores-llm-as-a-judge-overview-v1.mp4"
    />
  );
}
