/**
 * Hook for defining log view table columns.
 *
 * Extracts column configuration from TraceLogView for cleaner separation
 * of concerns. Columns include observation name, depth, start time, and duration.
 */

import { useMemo } from "react";
import { type JSONTableViewColumn } from "@/src/components/trace/components/_shared/JSONTableView";
import { type FlatLogItem } from "./log-view-types";
import { LogViewObservationCell } from "./LogViewObservationCell";
import { formatRelativeTime, formatDuration } from "./log-view-formatters";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export interface UseLogViewColumnsParams {
  /** Whether indent visualization is enabled */
  indentEnabled: boolean;
  /** Whether milliseconds are shown in time values */
  showMilliseconds: boolean;
  /** Project ID for data fetching */
  projectId: string;
  /** Trace ID for data fetching */
  traceId: string;
}

/**
 * Hook for defining log view table columns.
 */
export function useLogViewColumns({
  indentEnabled,
  showMilliseconds,
  projectId,
  traceId,
}: UseLogViewColumnsParams): JSONTableViewColumn<FlatLogItem>[] {
  const { translateText } = useI18n();

  return useMemo((): JSONTableViewColumn<FlatLogItem>[] => {
    return [
      {
        key: "observation",
        header: translateText("Observation"),
        width: "flex-1",
        render: (item) => (
          <LogViewObservationCell
            item={item}
            indentEnabled={indentEnabled}
            projectId={projectId}
            traceId={traceId}
          />
        ),
      },
      {
        key: "depth",
        header: translateText("Depth"),
        width: "w-12",
        align: "right" as const,
        render: (item) => (
          <span className="text-muted-foreground text-xs">
            {item.node.depth >= 0 ? `L${item.node.depth}` : "-"}
          </span>
        ),
      },
      {
        key: "start",
        header: translateText("Start"),
        width: showMilliseconds ? "w-20" : "w-12",
        align: "right" as const,
        render: (item) => (
          <span className="text-muted-foreground text-xs">
            {formatRelativeTime(
              item.node.startTimeSinceTrace,
              showMilliseconds,
            )}
          </span>
        ),
      },
      {
        key: "duration",
        header: translateText("Duration"),
        width: "w-16",
        align: "right" as const,
        render: (item) => (
          <span className="text-muted-foreground text-xs">
            {formatDuration(item.node.startTime, item.node.endTime)}
          </span>
        ),
      },
    ];
  }, [indentEnabled, showMilliseconds, projectId, traceId, translateText]);
}
