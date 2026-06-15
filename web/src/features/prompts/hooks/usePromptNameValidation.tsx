import { useEffect } from "react";
import { type UseFormReturn } from "react-hook-form";
import { useI18n } from "@/src/features/i18n/I18nProvider";

interface UsePromptNameValidationProps {
  currentName: string | undefined;
  allPrompts: { value: string }[] | undefined;
  form: UseFormReturn<any>;
}

export const usePromptNameValidation = ({
  currentName,
  allPrompts,
  form,
}: UsePromptNameValidationProps) => {
  const { translateText } = useI18n();
  const promptNameExistsMessage = translateText("Prompt name already exists.");

  useEffect(() => {
    if (!currentName || !allPrompts) return;

    const isNewPrompt = !allPrompts
      ?.map((prompt) => prompt.value)
      .includes(currentName);

    if (!isNewPrompt) {
      form.setError("name", { message: promptNameExistsMessage });
    } else {
      const currentError = form.getFieldState("name").error;
      if (currentError?.message === promptNameExistsMessage) {
        form.clearErrors("name");
      }
    }
  }, [currentName, allPrompts, form, promptNameExistsMessage]);
};
