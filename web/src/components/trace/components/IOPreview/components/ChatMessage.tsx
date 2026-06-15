import { useState } from "react";
import { cn } from "@/src/utils/tailwind";
import { Button } from "@/src/components/ui/button";
import { PrettyJsonView } from "@/src/components/ui/PrettyJsonView";
import {
  MarkdownJsonView,
  MarkdownJsonViewHeader,
} from "@/src/components/ui/MarkdownJsonView";
import { ToolCallInvocationsView } from "@/src/components/trace/components/ToolCallInvocationsView";
import { ListChevronsDownUp, ListChevronsUpDown } from "lucide-react";
import { copyTextToClipboard } from "@/src/utils/clipboard";
import {
  type ChatMlMessage,
  getMessageTitle,
  hasRenderableContent,
  hasAdditionalData,
  hasPassthroughJson,
  isPlaceholderMessage,
  isOnlyJsonMessage,
  parseToolCallsFromMessage,
  hasThinkingContent,
  hasRedactedThinkingContent,
} from "./chat-message-utils";
import { ThinkingBlock, RedactedThinkingBlock } from "./ThinkingBlock";
import { useI18n } from "@/src/features/i18n/I18nProvider";

// View mode for pretty/json toggle
export type ViewMode = "pretty" | "json";

// ChatMessage props
export interface ChatMessageProps {
  message: ChatMlMessage;
  shouldRenderMarkdown: boolean;
  currentView: ViewMode;
  toolCallNumbers?: number[];
  isOutputMessage?: boolean;
}

/**
 * ChatMessage renders a single ChatML message with appropriate view.
 *
 * Handles different message types:
 * - Placeholder messages
 * - JSON-only messages (non-ChatML objects)
 * - Content messages with optional tool calls
 * - Tool-call-only messages (no content)
 */
export function ChatMessage({
  message,
  shouldRenderMarkdown,
  currentView,
  toolCallNumbers,
  isOutputMessage,
}: ChatMessageProps) {
  const [showTableView, setShowTableView] = useState(false);
  const { t, translateText } = useI18n();

  const title = getMessageTitle(message);
  const displayTitle = title ? translateText(title) : undefined;
  const fallbackTitle = isOutputMessage
    ? translateText("Output")
    : translateText("Input");
  const toolCalls = parseToolCallsFromMessage(message);
  const hasContent = hasRenderableContent(message);

  // Toggle button for passthrough JSON
  const passthroughToggleButton = hasPassthroughJson(message) ? (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={() => setShowTableView((v) => !v)}
      title={
        showTableView
          ? t("ioPreview.showFormattedView")
          : t("ioPreview.showPassthroughJson")
      }
      className="hover:bg-border -mr-2"
    >
      {showTableView ? (
        <ListChevronsDownUp className="text-primary h-3 w-3" />
      ) : (
        <ListChevronsUpDown className="h-3 w-3" />
      )}
    </Button>
  ) : undefined;

  // Placeholder message
  if (isPlaceholderMessage(message)) {
    return (
      <div className={cn("hover:bg-muted transition-colors")}>
        <div style={{ display: shouldRenderMarkdown ? "block" : "none" }}>
          <MarkdownJsonView
            title={t("ioPreview.placeholder")}
            content={message.name || t("ioPreview.unnamedPlaceholder")}
            customCodeHeaderClassName={cn("bg-primary-foreground")}
          />
        </div>
        <div style={{ display: shouldRenderMarkdown ? "none" : "block" }}>
          <PrettyJsonView
            title={t("ioPreview.placeholder")}
            json={message.name || t("ioPreview.unnamedPlaceholder")}
            currentView={currentView}
          />
        </div>
      </div>
    );
  }

  // JSON-only message (non-ChatML object)
  if (isOnlyJsonMessage(message)) {
    return (
      <div className={cn("hover:bg-muted transition-colors")}>
        <PrettyJsonView
          title={displayTitle || fallbackTitle}
          json={message.json}
          currentView={currentView}
        />
      </div>
    );
  }

  // User toggled to show passthrough JSON
  if (showTableView) {
    return (
      <div className={cn("hover:bg-muted transition-colors")}>
        <PrettyJsonView
          title={displayTitle}
          json={message.json}
          currentView="pretty"
          controlButtons={passthroughToggleButton}
        />
      </div>
    );
  }

  // Tool-call-only message (no content, no thinking)
  if (
    !hasContent &&
    !hasThinkingContent(message) &&
    !hasRedactedThinkingContent(message) &&
    toolCalls.length > 0
  ) {
    return (
      <div className={cn("hover:bg-muted transition-colors")}>
        <MarkdownJsonViewHeader
          title={displayTitle}
          handleOnValueChange={() => {}}
          handleOnCopy={() => {
            const rawText = JSON.stringify(message, null, 2);
            copyTextToClipboard(rawText);
          }}
          controlButtons={passthroughToggleButton}
        />
        <ToolCallInvocationsView
          message={message}
          toolCallNumbers={toolCallNumbers}
        />
      </div>
    );
  }

  // Content message (with optional tool calls and thinking)
  if (
    hasContent ||
    hasThinkingContent(message) ||
    hasRedactedThinkingContent(message)
  ) {
    // Thinking blocks to render after header
    const thinkingBlocks = (
      <>
        {hasThinkingContent(message) &&
          message.thinking?.map((t, i) => (
            <ThinkingBlock
              key={`thinking-${i}`}
              content={t.content}
              summary={t.summary}
            />
          ))}
        {hasRedactedThinkingContent(message) &&
          message.redacted_thinking?.map((t, i) => (
            <RedactedThinkingBlock key={`redacted-${i}`} data={t.data} />
          ))}
      </>
    );

    return (
      <div className={cn("hover:bg-muted transition-colors")}>
        {/* Markdown view */}
        <div style={{ display: shouldRenderMarkdown ? "block" : "none" }}>
          <MarkdownJsonView
            title={displayTitle}
            content={message.content || ""}
            customCodeHeaderClassName={cn(
              message.role === "assistant" && "bg-secondary",
              message.role === "system" && "bg-primary-foreground",
            )}
            audio={message.audio}
            controlButtons={passthroughToggleButton}
            afterHeader={thinkingBlocks}
          />
          {toolCalls.length > 0 && (
            <div className="mt-2">
              <ToolCallInvocationsView
                message={message}
                toolCallNumbers={toolCallNumbers}
              />
            </div>
          )}
        </div>

        {/* JSON view */}
        <div style={{ display: shouldRenderMarkdown ? "none" : "block" }}>
          <PrettyJsonView
            title={displayTitle}
            json={message.content}
            currentView={currentView}
            controlButtons={passthroughToggleButton}
            afterHeader={thinkingBlocks}
          />
          {toolCalls.length > 0 && (
            <div className="mt-2">
              <ToolCallInvocationsView
                message={message}
                toolCallNumbers={toolCallNumbers}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback: message with additional data but no content
  if (hasAdditionalData(message)) {
    return (
      <div className={cn("hover:bg-muted transition-colors")}>
        <PrettyJsonView
          title={displayTitle || fallbackTitle}
          json={message}
          currentView={currentView}
        />
      </div>
    );
  }

  return null;
}
