import { StringNoHTML } from "@langfuse/shared";
import * as z from "zod";

type TranslateText = (text: string) => string;

const defaultTranslateText: TranslateText = (text) => text;

const createOrganizationName = (
  translateText: TranslateText = defaultTranslateText,
) =>
  StringNoHTML.min(3, translateText("Must have at least 3 characters")).max(
    60,
    translateText("Must have at most 60 characters"),
  );

export const createOrganizationFormSchema = (
  translateText: TranslateText = defaultTranslateText,
) =>
  z.object({
    name: createOrganizationName(translateText),
  });

// Base schema for org creation, used for server-side validation too
export const organizationFormSchema = createOrganizationFormSchema();
export const organizationNameSchema = organizationFormSchema;

export const organizationOptionalNameSchema = z.object({
  name: createOrganizationName().optional(),
});
