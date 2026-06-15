import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/src/components/ui/hover-card";
import { Info } from "lucide-react";
import { useI18n } from "@/src/features/i18n/I18nProvider";

interface SamplingMetadata {
  samplingRate: number;
  preflightEstimates?: {
    score1Count: number;
    score2Count: number;
    estimatedMatchedCount: number;
  };
  adaptiveFinal?: {
    usedFinal: boolean;
    reason: string;
  };
}

interface SamplingDetailsHoverCardProps {
  samplingMetadata: SamplingMetadata;
  mode?: "single" | "two";
  showLabel?: boolean;
}

export function SamplingDetailsHoverCard({
  samplingMetadata,
  mode = "two",
  showLabel = false,
}: SamplingDetailsHoverCardProps) {
  const { translateText } = useI18n();

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button
          className={
            showLabel
              ? "text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
              : "hover:bg-muted-foreground/10 inline-flex h-4 w-4 items-center justify-center rounded-full"
          }
          aria-label={translateText("View sampling details")}
        >
          {showLabel && <span>{translateText("Sampled Data")}</span>}
          <Info
            className={showLabel ? "h-3 w-3" : "text-muted-foreground h-3 w-3"}
          />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="start">
        <div className="space-y-3">
          <div>
            <h4 className="mb-2 text-sm font-semibold">
              {mode === "single"
                ? translateText("Estimated Score Count")
                : translateText("Estimated Scores")}
            </h4>
            <dl className="space-y-1 text-sm">
              {mode === "single" ? (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    {translateText("Total Scores")}:
                  </dt>
                  <dd className="font-medium">
                    ~
                    {samplingMetadata.preflightEstimates?.score1Count.toLocaleString()}
                  </dd>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      {translateText("Score 1")}:
                    </dt>
                    <dd className="font-medium">
                      ~
                      {samplingMetadata.preflightEstimates?.score1Count.toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      {translateText("Score 2")}:
                    </dt>
                    <dd className="font-medium">
                      ~
                      {samplingMetadata.preflightEstimates?.score2Count.toLocaleString()}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      {translateText("Estimated Matches")}:
                    </dt>
                    <dd className="font-medium">
                      ~
                      {samplingMetadata.preflightEstimates?.estimatedMatchedCount.toLocaleString()}
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold">
              {translateText("Query Optimizations")}
            </h4>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">
                  {translateText("Sampling")}:
                </dt>
                <dd className="font-medium">
                  {(samplingMetadata.samplingRate * 100).toFixed(1)}%{" "}
                  {translateText("(hash-based)")}
                </dd>
              </div>
              {samplingMetadata.adaptiveFinal && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    {translateText("Deduplication")}:
                  </dt>
                  <dd className="font-medium">
                    {samplingMetadata.adaptiveFinal.usedFinal
                      ? translateText("Enabled")
                      : translateText("Skipped for performance")}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <p className="text-muted-foreground text-xs">
            {translateText(
              "Hash-based sampling ensures consistent, repeatable results while maintaining statistical accuracy.",
            )}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
