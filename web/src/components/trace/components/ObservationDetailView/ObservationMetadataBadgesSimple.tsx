/**
 * Simple metadata badges for ObservationDetailView
 * Each badge handles its own null checks and returns null when data is unavailable
 */

import { Badge } from "@/src/components/ui/badge";
import { formatIntervalSeconds } from "@/src/utils/dates";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export function LatencyBadge({
  latencySeconds,
}: {
  latencySeconds: number | null;
}) {
  const { translateText } = useI18n();
  if (latencySeconds == null) return null;

  return (
    <Badge variant="tertiary">
      {translateText("Latency: {latency}", {
        latency: formatIntervalSeconds(latencySeconds),
      })}
    </Badge>
  );
}

export function TimeToFirstTokenBadge({
  timeToFirstToken,
}: {
  timeToFirstToken: number | null | undefined;
}) {
  const { translateText } = useI18n();
  if (timeToFirstToken == null) return null;

  return (
    <Badge variant="tertiary">
      {translateText("Time to first token: {time}", {
        time: formatIntervalSeconds(timeToFirstToken),
      })}
    </Badge>
  );
}

export function EnvironmentBadge({
  environment,
}: {
  environment: string | null | undefined;
}) {
  const { translateText } = useI18n();
  if (!environment) return null;

  return (
    <Badge variant="tertiary">
      {translateText("Env: {environment}", { environment })}
    </Badge>
  );
}

export function VersionBadge({
  version,
}: {
  version: string | null | undefined;
}) {
  const { translateText } = useI18n();
  if (!version) return null;

  return (
    <Badge variant="tertiary">
      {translateText("Version: {version}", { version })}
    </Badge>
  );
}

export function LevelBadge({ level }: { level: string | null | undefined }) {
  if (!level || level === "DEFAULT") return null;

  return (
    <Badge
      variant={
        level === "ERROR"
          ? "destructive"
          : level === "WARNING"
            ? "warning"
            : "tertiary"
      }
    >
      {level}
    </Badge>
  );
}

export function StatusMessageBadge({
  statusMessage,
}: {
  statusMessage: string | null | undefined;
}) {
  if (!statusMessage) return null;

  return <Badge variant="tertiary">{statusMessage}</Badge>;
}
