import { isNumericDataType } from "@/src/features/scores/lib/helpers";
import { useI18n } from "@/src/features/i18n/I18nProvider";
import { isPresent, type ScoreConfigDomain } from "@langfuse/shared";
import React from "react";

export function ScoreConfigDetails({ config }: { config: ScoreConfigDomain }) {
  const { translateText } = useI18n();
  const { name, description, minValue, maxValue, dataType } = config;
  if (!description && !isPresent(minValue) && !isPresent(maxValue)) return null;
  const isNameTruncated = name.length > 20;

  return (
    <div className="bg-background p-2 text-xs font-light text-wrap">
      {!!description && (
        <p>{translateText("Description: {description}", { description })}</p>
      )}
      {isNumericDataType(dataType) &&
      (isPresent(minValue) || isPresent(maxValue)) ? (
        <p>
          {translateText("Range: [{min}, {max}]", {
            min: minValue ?? "-∞",
            max: maxValue ?? "∞",
          })}
        </p>
      ) : null}
      {isNameTruncated && <p>{translateText("Full name: {name}", { name })}</p>}
    </div>
  );
}
