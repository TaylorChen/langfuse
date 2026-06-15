import { env } from "@/src/env.mjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { usePostHogClientCapture } from "@/src/features/posthog-analytics/usePostHogClientCapture";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { useLangfuseCloudRegion } from "@/src/features/organizations/hooks";
import { getAvailableCloudRegionOptions } from "@/src/features/organizations/cloudRegions";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export function CloudRegionSwitch({
  isSignUpPage,
}: {
  isSignUpPage?: boolean;
}) {
  const capture = usePostHogClientCapture();
  const { translateText } = useI18n();
  const { isLangfuseCloud, region: cloudRegion } = useLangfuseCloudRegion();
  const regions = getAvailableCloudRegionOptions(
    env.NEXT_PUBLIC_LANGFUSE_CLOUD_REGION ?? cloudRegion,
  );

  if (!isLangfuseCloud) return null;

  const currentRegion = regions.find((region) => region.name === cloudRegion);

  return (
    <div className="bg-card mt-8 -mb-10 rounded-lg px-6 py-6 text-sm sm:mx-auto sm:w-full sm:max-w-[480px] sm:rounded-lg sm:px-10">
      <div className="flex w-full flex-col gap-2">
        <div>
          <span className="text-sm leading-none font-medium">
            {translateText("Data Region")}
            <DataRegionInfo />
          </span>
          {isSignUpPage && cloudRegion === "HIPAA" ? (
            <p className="text-muted-foreground text-xs">
              {translateText(
                "Demo project is not available in the HIPAA data region.",
              )}
            </p>
          ) : null}
        </div>
        <Select
          value={currentRegion?.name}
          onValueChange={(value) => {
            const region = regions.find((region) => region.name === value);
            if (!region) return;
            capture(
              "sign_in:cloud_region_switch",
              {
                region: region.name,
              },
              {
                send_instantly: true,
              },
            );
            if (region.hostname) {
              window.location.hostname = region.hostname;
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.name} value={region.name}>
                <span className="mr-2 text-xl leading-none">{region.flag}</span>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {cloudRegion === "HIPAA" && (
          <div className="bg-muted/50 text-muted-foreground mt-2 rounded-md p-3 text-xs">
            <p>
              {translateText(
                "The Business Associate Agreement (BAA) is only effective on the Cloud Pro and Teams plans.",
              )}{" "}
              <a
                href="https://langfuse.com/security/hipaa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-accent hover:text-hover-primary-accent underline"
              >
                {translateText("Learn more about HIPAA compliance →")}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const DataRegionInfo = () => {
  const { translateText } = useI18n();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <a
          href="#"
          className="text-primary-accent hover:text-hover-primary-accent ml-1 text-xs"
          title={translateText("What is this?")}
          tabIndex={-1}
        >
          {translateText("(what is this?)")}
        </a>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{translateText("Data Regions")}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription className="flex flex-col gap-2">
            <p>
              {translateText(
                "Langfuse Cloud is available in four data regions:",
              )}
            </p>
            <ul className="list-disc pl-5">
              <li>{translateText("US: Oregon (AWS us-west-2)")}</li>
              <li>{translateText("EU: Ireland (AWS eu-west-1)")}</li>
              <li>{translateText("JP: Tokyo (AWS ap-northeast-1)")}</li>
              <li>
                {translateText(
                  "HIPAA: Oregon (AWS us-west-2) - HIPAA-compliant region (available with Pro and Teams plans)",
                )}
              </li>
            </ul>
            <p>
              {translateText(
                "Regions are strictly separated, and no data is shared across regions. Choosing a region close to you can help improve speed and comply with local data residency laws and privacy regulations.",
              )}
            </p>
            <p>
              {translateText(
                "You can have accounts in multiple regions. Each region requires a separate subscription.",
              )}
            </p>
            <p>
              {translateText("Learn more about")}{" "}
              <a
                href="https://langfuse.com/security/data-regions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-accent underline"
              >
                {translateText("data regions")}
              </a>{" "}
              {translateText("and")}{" "}
              <a
                href="https://langfuse.com/docs/data-security-privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-accent underline"
              >
                {translateText("data security & privacy")}
              </a>
              .
            </p>
          </DialogDescription>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};
