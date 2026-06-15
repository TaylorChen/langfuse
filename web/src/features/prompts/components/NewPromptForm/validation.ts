import { z } from "zod";
import {
  ChatMessageType,
  PlaceholderMessageSchema,
  PromptChatMessageListSchema,
  PromptNameSchema,
  TextPromptContentSchema,
  COMMIT_MESSAGE_MAX_LENGTH,
  PromptType,
} from "@langfuse/shared";

type TranslateText = (
  text: string,
  values?: Record<string, string | number | undefined>,
) => string;

const defaultTranslateText: TranslateText = (text) => text;

export const createNewPromptFormSchema = (
  translateText: TranslateText = defaultTranslateText,
) => {
  const NewPromptBaseSchema = z.object({
    name: PromptNameSchema,
    isActive: z.boolean({
      error: translateText("Enter whether the prompt should go live"),
    }),
    config: z
      .string()
      .refine(validateJson, translateText("Config needs to be valid JSON")),
    commitMessage: z
      .string()
      .trim()
      .max(COMMIT_MESSAGE_MAX_LENGTH)
      .transform((val) => (val === "" ? undefined : val))
      .optional(),
  });

  const NewChatPromptSchema = NewPromptBaseSchema.extend({
    type: z.literal(PromptType.Chat),
    chatPrompt: z
      .array(z.any())
      .refine(
        (messages: Array<{ type?: ChatMessageType; content?: string }>) =>
          messages.every((message) => {
            const isPlaceholder = message?.type === ChatMessageType.Placeholder;
            return (
              !isPlaceholder ||
              PlaceholderMessageSchema.safeParse(message).success
            );
          }),
        translateText(
          "Placeholder name must start with a letter and contain only alphanumeric characters and underscores",
        ),
      )
      .refine(
        (messages: Array<{ type?: ChatMessageType; content?: string }>) =>
          messages.every((message) => {
            const isPlaceholder = message?.type === ChatMessageType.Placeholder;
            return isPlaceholder || Boolean(message?.content?.trim()?.length);
          }),
        translateText("Enter a chat message or remove the empty message"),
      ),
    textPrompt: z.string(),
  });

  const NewTextPromptSchema = NewPromptBaseSchema.extend({
    type: z.literal(PromptType.Text),
    chatPrompt: z.array(z.any()),
    textPrompt: TextPromptContentSchema,
  });

  return z.discriminatedUnion("type", [
    NewChatPromptSchema,
    NewTextPromptSchema,
  ]);
};

export const NewPromptFormSchema = createNewPromptFormSchema();
export type NewPromptFormSchemaType = z.infer<typeof NewPromptFormSchema>;

export const PromptVariantSchema = z.union([
  z.object({
    type: z.literal(PromptType.Chat),
    prompt: PromptChatMessageListSchema,
  }),
  z.object({
    type: z.literal(PromptType.Text),
    prompt: z.string(),
  }),
]);
export type PromptVariant = z.infer<typeof PromptVariantSchema>;

function validateJson(content: string): boolean {
  try {
    JSON.parse(content);

    return true;
  } catch (_e) {
    return false;
  }
}
