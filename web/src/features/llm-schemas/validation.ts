import { z } from "zod";
import { LLMJSONSchema } from "@langfuse/shared";

type TranslateText = (text: string) => string;

const defaultTranslateText: TranslateText = (text) => text;

export const createLLMSchemaNameSchema = (
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

export const LLMSchemaNameSchema = createLLMSchemaNameSchema();

export const LLMSchemaInput = z.object({
  name: LLMSchemaNameSchema,
  description: z.string(),
  schema: LLMJSONSchema,
});

export const CreateLlmSchemaInput = LLMSchemaInput.extend({
  projectId: z.string(),
});

export const UpdateLlmSchemaInput = LLMSchemaInput.extend({
  id: z.string(),
  projectId: z.string(),
});

export const DeleteLlmSchemaInput = z.object({
  id: z.string(),
  projectId: z.string(),
});
