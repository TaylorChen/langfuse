import { type FilterState, type TableViewPresetState } from "@langfuse/shared";
import { formatSessionPositionInTraceFilterValue } from "@/src/components/session/session-position-in-trace";
import { type TranslationKey } from "@/src/features/i18n/messages";

type TranslateText = (text: string) => string;
type Translate = (
  key: TranslationKey,
  values?: Record<string, string | number | undefined>,
) => string;

function formatFilterLabel(
  filter: FilterState[number],
  translateText: TranslateText,
) {
  const label =
    "key" in filter && filter.key
      ? `${filter.column}.${filter.key}`
      : filter.column;

  return translateText(label);
}

function formatFilterValue(
  filter: FilterState[number],
  translateText: TranslateText,
) {
  if (filter.type === "null") return "";

  if (filter.type === "positionInTrace") {
    return translateText(formatSessionPositionInTraceFilterValue(filter));
  }

  if (filter.type === "datetime") {
    const dateValue =
      filter.value instanceof Date ? filter.value : new Date(filter.value);

    return Number.isNaN(dateValue.getTime())
      ? String(filter.value)
      : dateValue.toISOString().slice(0, 10);
  }

  if (Array.isArray(filter.value)) {
    return filter.value.map((value) => translateText(String(value))).join(", ");
  }

  return translateText(String(filter.value));
}

export function formatFilterPreview(
  filter: FilterState[number],
  translateText: TranslateText = (text) => text,
) {
  const label = formatFilterLabel(filter, translateText);
  const operator = translateText(filter.operator);

  if (filter.type === "null") {
    return `${label} ${operator}`;
  }

  return `${label} ${operator} ${formatFilterValue(filter, translateText)}`;
}

export function summarizeTableViewPreset(
  view: TableViewPresetState,
  translateText: TranslateText = (text) => text,
  t?: Translate,
) {
  const previewParts = view.filters.map((filter) =>
    formatFilterPreview(filter, translateText),
  );

  if (previewParts.length < 2 && view.searchQuery?.trim()) {
    previewParts.push(
      t
        ? t("tableView.previewSearch", { query: view.searchQuery.trim() })
        : `Search "${view.searchQuery.trim()}"`,
    );
  }

  if (previewParts.length < 2 && view.orderBy?.column) {
    previewParts.push(
      t
        ? t("tableView.previewSort", {
            column: translateText(view.orderBy.column),
            order: translateText(view.orderBy.order),
          })
        : `Sort ${view.orderBy.column} ${view.orderBy.order}`,
    );
  }

  if (
    previewParts.length === 0 &&
    (view.columnOrder.length > 0 ||
      Object.keys(view.columnVisibility).length > 0)
  ) {
    previewParts.push(
      t ? t("tableView.savedColumnLayout") : "Saved column layout",
    );
  }

  return previewParts.join(" · ");
}
