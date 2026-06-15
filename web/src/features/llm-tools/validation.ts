import { z } from "zod";
import { LLMJSONSchema } from "@langfuse/shared";

type TranslateText = (text: string) => string;

const defaultTranslateText: TranslateText = (text) => text;

export const createLLMToolNameSchema = (
  translateText: TranslateText = defaultTranslateText,
) =>
  z
    .string()
    .regex(
      /^[a-zA-Z0-9\._-]+$/,
      translateText(
        "Name must contain only alphanumeric letters, hyphens, periods and underscores",
      ),
    )
    .min(1, translateText("Name is required"));

export const LLMToolNameSchema = createLLMToolNameSchema();

export const LLMToolInput = z.object({
  name: LLMToolNameSchema,
  description: z.string(),
  parameters: LLMJSONSchema,
});

export const CreateLlmToolInput = LLMToolInput.extend({
  projectId: z.string(),
});

export const UpdateLlmToolInput = LLMToolInput.extend({
  id: z.string(),
  projectId: z.string(),
});

export const DeleteLlmToolInput = z.object({
  id: z.string(),
  projectId: z.string(),
});
