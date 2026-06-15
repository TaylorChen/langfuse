// Langfuse Cloud only

import { LocalIsoDate } from "@/src/components/LocalIsoDate";

import { useBillingInformation } from "@/src/ee/features/billing/components/useBillingInformation";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export const BillingCurrentPlanLabel = () => {
  const { planLabel, cancellation } = useBillingInformation();
  const { translateText } = useI18n();

  return (
    <div>
      <>{translateText("Current plan: {planLabel}", { planLabel })} </>
      {cancellation?.isCancelled && cancellation.date && (
        <>
          <span>{translateText("(will end on")} </span>
          <LocalIsoDate date={cancellation.date} accuracy="day" />
          <span>)</span>
        </>
      )}
    </div>
  );
};
