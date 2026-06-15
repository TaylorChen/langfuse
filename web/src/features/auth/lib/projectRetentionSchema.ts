import * as z from "zod";

type TranslateText = (text: string) => string;

const defaultTranslateText: TranslateText = (text) => text;

export const createProjectRetentionSchema = (
  translateText: TranslateText = defaultTranslateText,
) =>
  z.object({
    retention: z.coerce
      .number()
      .int(translateText("Must be an integer"))
      .refine((value) => value === 0 || value >= 3, {
        message: translateText("Value must be 0 or at least 3 days"),
      }),
  });

export const projectRetentionSchema = createProjectRetentionSchema();
