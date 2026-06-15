// This page is part of the cloud signup flow and can also be opened directly for local testing.

import Head from "next/head";
import { OnboardingSurvey } from "@/src/features/onboarding/components/OnboardingSurvey";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export default function OnboardingPage() {
  const { translateText } = useI18n();

  return (
    <>
      <Head>
        <title>{translateText("Onboarding | Langfuse")}</title>
      </Head>
      <OnboardingSurvey />
    </>
  );
}
