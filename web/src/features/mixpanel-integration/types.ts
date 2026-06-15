import { AnalyticsIntegrationExportSource } from "@langfuse/shared";
import { z } from "zod";

type TranslateText = (text: string) => string;

const defaultTranslateText: TranslateText = (text) => text;

export const MIXPANEL_REGIONS = [
  {
    subdomain: "api",
    description: "US (api.mixpanel.com)",
  },
  {
    subdomain: "api-eu",
    description: "EU (api-eu.mixpanel.com)",
  },
  {
    subdomain: "api-in",
    description: "India (api-in.mixpanel.com)",
  },
] as const;

export type MixpanelRegion = (typeof MIXPANEL_REGIONS)[number]["subdomain"];

export const createMixpanelIntegrationFormSchema = (
  translateText: TranslateText = defaultTranslateText,
) =>
  z.object({
    mixpanelRegion: z.enum(MIXPANEL_REGIONS.map((r) => r.subdomain)),
    mixpanelProjectToken: z
      .string()
      .min(1, translateText("Project Token is required"))
      .refine(
        (v) => v.length > 0,
        translateText(
          "Mixpanel Project Token is required. You can find it in your Mixpanel project settings.",
        ),
      ),
    enabled: z.boolean(),
    exportSource: z
      .enum(AnalyticsIntegrationExportSource)
      .default(AnalyticsIntegrationExportSource.TRACES_OBSERVATIONS),
  });

export const mixpanelIntegrationFormSchema =
  createMixpanelIntegrationFormSchema();
