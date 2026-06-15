import { cn } from "@/src/utils/tailwind";
import Link from "next/link";
import { VersionLabel } from "./VersionLabel";
import { env } from "@/src/env.mjs";
import { useUiCustomization } from "@/src/ee/features/ui-customization/useUiCustomization";
import { PlusIcon } from "lucide-react";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export const LangfuseIcon = ({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) => {
  const { translateText } = useI18n();

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${env.NEXT_PUBLIC_BASE_PATH ?? ""}/icon.svg`}
      width={size}
      height={size}
      alt={translateText("Langfuse Icon")}
      className={className}
    />
  );
};

const LangfuseLogotypeOrCustomized = () => {
  const uiCustomization = useUiCustomization();
  const { translateText } = useI18n();

  if (uiCustomization?.logoLightModeHref && uiCustomization?.logoDarkModeHref) {
    // logo is a url, maximum aspect ratio of 1:3 needs to be supported according to docs
    return (
      <div className="flex items-center gap-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={uiCustomization.logoLightModeHref}
          alt={translateText("Langfuse Logo")}
          className={cn(
            "group-data-[collapsible=icon]:hidden dark:hidden",
            "max-h-4 max-w-14",
          )}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={uiCustomization.logoDarkModeHref}
          alt={translateText("Langfuse Logo")}
          className={cn(
            "hidden group-data-[collapsible=icon]:hidden dark:block",
            "max-h-4 max-w-14",
          )}
        />
        <PlusIcon size={8} className="group-data-[collapsible=icon]:hidden" />
        <LangfuseIcon size={16} />
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="-ml-1.5 max-h-6 max-w-22 group-data-[collapsible=icon]:hidden dark:hidden"
        src={`${env.NEXT_PUBLIC_BASE_PATH ?? ""}/wordart-black.svg`}
        alt={translateText("Langfuse Logo")}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="-ml-1.5 hidden max-h-6 max-w-22 group-data-[collapsible=icon]:hidden dark:block"
        src={`${env.NEXT_PUBLIC_BASE_PATH ?? ""}/wordart-white.svg`}
        alt={translateText("Langfuse Logo")}
      />
      <LangfuseIcon
        size={28}
        className="hidden scale-120 group-data-[collapsible=icon]:block"
      />
    </div>
  );
};

export const LangfuseLogo = ({ version = false }: { version?: boolean }) => {
  return (
    <div className="-mt-2 ml-1 flex flex-wrap gap-4 lg:flex-col lg:items-start">
      {/* Langfuse Logo */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center">
          <LangfuseLogotypeOrCustomized />
        </Link>
        {version && (
          <VersionLabel className="ml-2 group-data-[collapsible=icon]:hidden" />
        )}
      </div>
    </div>
  );
};
