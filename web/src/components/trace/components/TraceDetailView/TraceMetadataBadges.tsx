/**
 * TraceMetadataBadges - Extracted badge components for trace metadata
 *
 * Following the pattern from ObservationDetailView/ObservationMetadataBadgesSimple.tsx
 * Each badge handles its own null check and returns null when data is unavailable.
 */

import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export function SessionBadge({
  sessionId,
  projectId,
}: {
  sessionId: string | null;
  projectId: string;
}) {
  const { translateText } = useI18n();
  if (!sessionId) return null;
  return (
    <Link
      href={`/project/${projectId}/sessions/${encodeURIComponent(sessionId)}`}
      className="inline-flex"
    >
      <Badge>
        <span className="truncate">
          {translateText("Session:")} {sessionId}
        </span>
        <ExternalLinkIcon className="ml-1 h-3 w-3" />
      </Badge>
    </Link>
  );
}

export function UserIdBadge({
  userId,
  projectId,
}: {
  userId: string | null;
  projectId: string;
}) {
  const { translateText } = useI18n();
  if (!userId) return null;
  return (
    <Link
      href={`/project/${projectId}/users/${encodeURIComponent(userId)}`}
      className="inline-flex"
    >
      <Badge>
        <span className="truncate">
          {translateText("User ID:")} {userId}
        </span>
        <ExternalLinkIcon className="ml-1 h-3 w-3" />
      </Badge>
    </Link>
  );
}

export function TargetTraceBadge({
  targetTraceId,
  projectId,
}: {
  targetTraceId: string | null;
  projectId: string;
}) {
  const { translateText } = useI18n();
  if (!targetTraceId) return null;
  return (
    <Link
      href={`/project/${projectId}/traces/${encodeURIComponent(targetTraceId)}`}
      className="inline-flex"
    >
      <Badge>
        <span className="truncate">
          {translateText("Target Trace:")} {targetTraceId}
        </span>
        <ExternalLinkIcon className="ml-1 h-3 w-3" />
      </Badge>
    </Link>
  );
}

export function EnvironmentBadge({
  environment,
}: {
  environment: string | null;
}) {
  const { translateText } = useI18n();
  if (!environment) return null;
  return (
    <Badge variant="tertiary">
      {translateText("Env:")} {environment}
    </Badge>
  );
}

export function ReleaseBadge({ release }: { release: string | null }) {
  const { translateText } = useI18n();
  if (!release) return null;
  return (
    <Badge variant="tertiary">
      {translateText("Release:")} {release}
    </Badge>
  );
}

export function VersionBadge({ version }: { version: string | null }) {
  const { translateText } = useI18n();
  if (!version) return null;
  return (
    <Badge variant="tertiary">
      {translateText("Version:")} {version}
    </Badge>
  );
}
