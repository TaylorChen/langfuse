import { useRouter } from "next/router";
import { api } from "@/src/utils/api";
import { formatLocalIsoDate } from "@/src/components/LocalIsoDate";
import { BillingCurrentPlanLabel } from "./BillingCurrentPlanLabel";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export const BillingPlanPeriodView = () => {
  const { translateText } = useI18n();
  const router = useRouter();
  const orgId = router.query.organizationId as string | undefined;

  const { data, isLoading } = api.cloudBilling.getSubscriptionInfo.useQuery(
    { orgId: orgId ?? "" },
    { enabled: Boolean(orgId) },
  );

  return (
    <div className="text-muted-foreground flex flex-col gap-1 text-sm">
      <BillingCurrentPlanLabel />
      <p>
        {translateText("Billing period")}:{" "}
        {!isLoading && data?.billingPeriod && (
          <>
            {`${formatLocalIsoDate(data.billingPeriod.start, false, "day")} - ${formatLocalIsoDate(data.billingPeriod.end, false, "day")}`}
          </>
        )}
      </p>
    </div>
  );
};

export default BillingPlanPeriodView;
