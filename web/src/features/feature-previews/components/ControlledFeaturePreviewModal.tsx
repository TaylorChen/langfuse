import { useSession } from "next-auth/react";
import type { Session } from "next-auth";

import { useHasEntitlement } from "@/src/features/entitlements/hooks";
import { useQueryProjectOrOrganization } from "@/src/features/projects/hooks";
import { showErrorToast } from "@/src/features/notifications/showErrorToast";
import { showSuccessToast } from "@/src/features/notifications/showSuccessToast";
import { api } from "@/src/utils/api";
import { useI18n } from "@/src/features/i18n/I18nProvider";

import { FeaturePreviewModal } from "./FeaturePreviewModal";

type ControlledFeaturePreviewModalProps = {
  session: Session;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ControlledFeaturePreviewModal({
  session,
  open,
  onOpenChange,
}: ControlledFeaturePreviewModalProps) {
  const authSession = useSession();
  const { translateText } = useI18n();
  const { project, organization } = useQueryProjectOrOrganization();
  const hasInAppAgentEntitlement = useHasEntitlement("in-app-agent");
  const setInAppAgentPreviewEnabled =
    api.userAccount.setInAppAgentPreviewEnabled.useMutation({
      onSuccess: async (_data, variables) => {
        await authSession.update();
        showSuccessToast({
          title: translateText("Feature preview updated"),
          description: variables.enabled
            ? translateText("Langfuse Assistant preview has been enabled.")
            : translateText("Langfuse Assistant preview has been disabled."),
        });
      },
      onError: (error) => {
        showErrorToast(
          translateText("Failed to update feature preview"),
          error.message,
        );
      },
    });

  const user = authSession.data?.user ?? session.user;
  if (!user) {
    return null;
  }

  const inAppAgentEnabledByUser = user.featureFlags.inAppAgent === true;
  const warningReason = getInAppAgentWarningReason({
    hasOrganizationContext: Boolean(organization),
    hasProjectContext: Boolean(project),
    hasInAppAgentEntitlement,
    organizationAiFeaturesEnabled: organization?.aiFeaturesEnabled,
    translateText,
  });

  return (
    <FeaturePreviewModal
      open={open}
      onOpenChange={onOpenChange}
      inAppAgent={{
        enabled: inAppAgentEnabledByUser,
        warningReason,
        onToggle: (enabled) => {
          setInAppAgentPreviewEnabled.mutate({
            enabled,
          });
        },
        isToggling: setInAppAgentPreviewEnabled.isPending,
      }}
    />
  );
}

function getInAppAgentWarningReason({
  hasOrganizationContext,
  hasProjectContext,
  hasInAppAgentEntitlement,
  organizationAiFeaturesEnabled,
  translateText,
}: {
  hasOrganizationContext: boolean;
  hasProjectContext: boolean;
  hasInAppAgentEntitlement: boolean;
  organizationAiFeaturesEnabled?: boolean;
  translateText: (text: string) => string;
}) {
  if (!hasOrganizationContext) {
    return translateText(
      "The Assistant button is only shown inside a project. Enabling this preview may not have any visible effect until you open a project.",
    );
  }

  if (!hasInAppAgentEntitlement) {
    return translateText(
      "The Langfuse Assistant preview is not available on your current plan. You can enable the preview, but the Assistant button will not be shown here.",
    );
  }

  if (organizationAiFeaturesEnabled === false) {
    return translateText(
      "AI features are disabled for this organization. You can enable the preview, but the Assistant will not run here until AI features are enabled.",
    );
  }

  if (!hasProjectContext) {
    return translateText(
      "The Assistant button is only shown inside a project. Open a project to use it after enabling the preview.",
    );
  }

  return undefined;
}
