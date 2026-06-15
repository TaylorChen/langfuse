import { useQueryProject } from "@/src/features/projects/hooks";
import { useI18n } from "@/src/features/i18n/I18nProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ProjectBillingRedirect() {
  const { translateText } = useI18n();
  const router = useRouter();

  const { organization } = useQueryProject();

  useEffect(() => {
    if (organization) {
      router.replace(`/organization/${organization.id}/settings/billing`);
    }
  }, [organization, router]);

  return translateText("Redirecting...");
}
