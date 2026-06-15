import { noUrlCheck, StringNoHTMLNonEmpty } from "@langfuse/shared";
import * as z from "zod";

type TranslateText = (text: string) => string;

const defaultTranslateText: TranslateText = (text) => text;

export const createPasswordSchema = (
  translateText: TranslateText = defaultTranslateText,
) =>
  z
    .string()
    .min(8, {
      message: translateText("Password must be at least 8 characters long."),
    })
    .regex(/[A-Za-z]/, {
      message: translateText(
        "Please choose a secure password by combining letters, numbers, and special characters.",
      ),
    })
    .regex(/[0-9]/, {
      message: translateText(
        "Please choose a secure password by combining letters, numbers, and special characters.",
      ),
    })
    .regex(/[^A-Za-z0-9]/, {
      message: translateText(
        "Please choose a secure password by combining letters, numbers, and special characters.",
      ),
    });

export const passwordSchema = createPasswordSchema();

export const createNameSchema = (
  translateText: TranslateText = defaultTranslateText,
) =>
  StringNoHTMLNonEmpty.max(
    100,
    translateText("Name must be at most 100 characters"),
  )
    .transform((value) =>
      value.normalize("NFC").replace(/[\u2018\u2019]/g, "'"),
    )
    .refine((value) => noUrlCheck(value), {
      message: translateText("Input should not contain a URL"),
    })
    .refine((value) => /^\p{L}[\p{L}\p{M}\p{N}\s.'\-]*$/u.test(value), {
      message: translateText(
        "Name must start with a letter and can only contain letters, numbers, spaces, hyphens, apostrophes, and periods",
      ),
    });

export const nameSchema = createNameSchema();

export const createSignupSchema = (
  translateText: TranslateText = defaultTranslateText,
) =>
  z.object({
    name: createNameSchema(translateText),
    email: z.email(translateText("Invalid email address")),
    password: createPasswordSchema(translateText),
    referralSource: z.string().optional(),
  });

export const signupSchema = createSignupSchema();
