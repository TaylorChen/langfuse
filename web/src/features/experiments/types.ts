import { ZodModelConfig } from "@langfuse/shared";
import z from "zod";

type TranslateText = (text: string) => string;

const defaultTranslateText: TranslateText = (text) => text;

export const createExperimentDataSchema = (
  translateText: TranslateText = defaultTranslateText,
) =>
  z.object({
    name: z
      .string()
      .min(1, translateText("Please enter an experiment name"))
      .transform((str) => str.trim()),
    runName: z.string().min(1, translateText("Run name is required")),
    promptId: z.string().min(1, translateText("Please select a prompt")),
    datasetId: z.string().min(1, translateText("Please select a dataset")),
    datasetVersion: z.coerce.date().optional(),
    description: z.string().max(1000).optional(),
    modelConfig: z.object({
      provider: z.string().min(1, translateText("Please select a provider")),
      model: z.string().min(1, translateText("Please select a model")),
      modelParams: ZodModelConfig,
    }),
    structuredOutputSchema: z.record(z.string(), z.unknown()).optional(),
  });

export const CreateExperimentData = createExperimentDataSchema();

export type CreateExperiment = z.infer<typeof CreateExperimentData>;
