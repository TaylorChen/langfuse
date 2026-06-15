import * as z from "zod";
import { StringNoHTML } from "@langfuse/shared";

type TranslateText = (text: string) => string;

const defaultTranslateText: TranslateText = (text) => text;

export const createProjectNameSchema = (
  translateText: TranslateText = defaultTranslateText,
) =>
  z.object({
    name: StringNoHTML.min(
      3,
      translateText("Must have at least 3 characters"),
    ).max(60, translateText("Must have at most 60 characters")),
  });

export const projectNameSchema = createProjectNameSchema();
