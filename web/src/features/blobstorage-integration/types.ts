import { z } from "zod";
import {
  BlobStorageIntegrationType,
  BlobStorageIntegrationFileType,
  BlobStorageExportMode,
  AnalyticsIntegrationExportSource,
  OBSERVATION_FIELD_GROUPS_FULL,
} from "@langfuse/shared";
import {
  validateAzureContainerName,
  validateExportFieldGroups,
} from "@/src/features/blobstorage-integration/validation";

type TranslateText = (text: string) => string;

const defaultTranslateText: TranslateText = (text) => text;

export const createBlobStorageIntegrationFormSchemaBase = (
  translateText: TranslateText = defaultTranslateText,
) =>
  z.object({
    type: z.enum(BlobStorageIntegrationType),
    bucketName: z
      .string()
      .min(1, { message: translateText("Bucket name is required") }),
    endpoint: z.url().optional().nullable(),
    region: z.string().default("auto"),
    accessKeyId: z.string().optional(),
    secretAccessKey: z.string().nullable().optional(),
    prefix: z
      .string()
      .refine((value) => !value || value === "" || value.endsWith("/"), {
        message: translateText("Prefix must end with a forward slash (/)"),
      })
      .optional()
      .or(z.literal("")),
    exportFrequency: z.enum(["every_20_minutes", "hourly", "daily", "weekly"]),
    enabled: z.boolean(),
    forcePathStyle: z.boolean(),
    fileType: z
      .enum(BlobStorageIntegrationFileType)
      .default(BlobStorageIntegrationFileType.JSONL),
    exportMode: z
      .enum(BlobStorageExportMode)
      .default(BlobStorageExportMode.FULL_HISTORY),
    exportStartDate: z.coerce.date().optional().nullable(),
    exportSource: z
      .enum(AnalyticsIntegrationExportSource)
      .default(AnalyticsIntegrationExportSource.TRACES_OBSERVATIONS),
    exportFieldGroups: z
      .array(z.enum(OBSERVATION_FIELD_GROUPS_FULL))
      .default([...OBSERVATION_FIELD_GROUPS_FULL]),
    compressed: z.boolean().default(true),
  });

export const blobStorageIntegrationFormSchemaBase =
  createBlobStorageIntegrationFormSchemaBase();

export const createBlobStorageIntegrationFormSchema = (
  translateText: TranslateText = defaultTranslateText,
) =>
  createBlobStorageIntegrationFormSchemaBase(translateText)
    .superRefine((data, ctx) =>
      validateAzureContainerName(data, ctx, translateText),
    )
    .superRefine((data, ctx) =>
      validateExportFieldGroups(data, ctx, translateText),
    );

export const blobStorageIntegrationFormSchema =
  createBlobStorageIntegrationFormSchema();

export type BlobStorageIntegrationFormSchema = z.infer<
  typeof blobStorageIntegrationFormSchema
>;

export type BlobStorageSyncStatus =
  | "idle"
  | "queued"
  | "up_to_date"
  | "disabled"
  | "error";
