import React from "react";
import {
  SplashScreen,
  type ValueProposition,
} from "@/src/components/ui/splash-screen";
import { ThumbsUp, Star, LineChart, Code } from "lucide-react";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export function ScoresOnboarding() {
  const { translateText } = useI18n();
  const valuePropositions: ValueProposition[] = [
    {
      title: translateText("Collect user feedback"),
      description: translateText(
        "Gather thumbs up/down feedback from users to identify high and low quality outputs",
      ),
      icon: <ThumbsUp className="h-4 w-4" />,
    },
    {
      title: translateText("Run model-based evaluations"),
      description: translateText(
        "Use LLMs to automatically evaluate your application's outputs",
      ),
      icon: <Star className="h-4 w-4" />,
    },
    {
      title: translateText("Track quality metrics"),
      description: translateText(
        "Monitor quality metrics over time to identify trends and issues",
      ),
      icon: <LineChart className="h-4 w-4" />,
    },
    {
      title: translateText("Use custom metrics"),
      description: translateText(
        "Langfuse's scores are flexible and can be used to track any metric that's associated with an LLM application",
      ),
      icon: <Code className="h-4 w-4" />,
    },
  ];

  return (
    <SplashScreen
      title={translateText("Get Started with Scores")}
      description={translateText(
        "Scores allow you to evaluate the quality/safety of your LLM application through user feedback, model-based evaluations, or manual review. Scores can be used programmatically via the API and SDKs to track custom metrics.",
      )}
      valuePropositions={valuePropositions}
      secondaryAction={{
        label: translateText("Learn More"),
        href: "https://langfuse.com/docs/evaluation/evaluation-methods/custom-scores",
      }}
      videoSrc="https://static.langfuse.com/prod-assets/onboarding/scores-overview-v1.mp4"
    />
  );
}
