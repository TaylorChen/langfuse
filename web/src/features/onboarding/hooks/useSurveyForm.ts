import { useForm } from "react-hook-form";
import { useCallback } from "react";
import type { SurveyFormData } from "../lib/surveyTypes";
import { api } from "@/src/utils/api";
import { SurveyName } from "@prisma/client";
import { useSession } from "next-auth/react";
import { showErrorToast } from "@/src/features/notifications/showErrorToast";
import { showSuccessToast } from "@/src/features/notifications/showSuccessToast";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export function useSurveyForm() {
  const { data: session } = useSession();
  const { translateText } = useI18n();
  const createSurveyMutation = api.surveys.create.useMutation({
    onSuccess: () => {
      showSuccessToast({
        title: translateText("Survey submitted"),
        description: translateText("Thank you for your feedback!"),
      });
    },
    onError: (error) => {
      showErrorToast(
        translateText("Failed to submit survey"),
        error.message || translateText("Please try again later."),
      );
    },
  });

  const form = useForm<SurveyFormData>({
    defaultValues: {
      referralSource: undefined,
    },
  });

  const handleSubmit = useCallback(
    async (data: SurveyFormData) => {
      const transformedResponse: Record<string, string> = {};
      if (data.referralSource)
        transformedResponse["referralSource"] = data.referralSource.trim();

      try {
        await createSurveyMutation.mutateAsync({
          surveyName: SurveyName.USER_ONBOARDING,
          response: transformedResponse,
          orgId: session?.user?.organizations?.[0]?.id,
        });
      } catch {
        // Error handling is done in the mutation callbacks
        // This catch block is for any additional error handling if needed
      }
    },
    [createSurveyMutation, session],
  );

  return {
    form,
    handleSubmit,
  };
}
