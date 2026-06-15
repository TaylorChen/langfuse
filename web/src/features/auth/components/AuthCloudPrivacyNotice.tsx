import { env } from "@/src/env.mjs";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export const CloudPrivacyNotice = ({ action }: { action: string }) => {
  const { locale, t } = useI18n();
  const listSeparator = locale === "zh-CN" ? "、" : ", ";
  const finalSeparator = locale === "zh-CN" ? "和" : ", and ";

  return env.NEXT_PUBLIC_LANGFUSE_CLOUD_REGION !== undefined ? (
    <div className="text-muted-foreground mx-auto mt-10 max-w-lg text-center text-xs">
      {t("auth.cloudPrivacyNotice.prefix", { action })}{" "}
      <a
        href="https://langfuse.com/terms"
        target="_blank"
        rel="noopener noreferrer"
        className="italic"
      >
        {t("auth.cloudPrivacyNotice.terms")}
      </a>
      {listSeparator}
      <a
        href="https://langfuse.com/privacy"
        rel="noopener noreferrer"
        className="italic"
      >
        {t("auth.cloudPrivacyNotice.privacy")}
      </a>
      {finalSeparator}
      <a
        href="https://langfuse.com/cookie-policy"
        rel="noopener noreferrer"
        className="italic"
      >
        {t("auth.cloudPrivacyNotice.cookies")}
      </a>
      . {t("auth.cloudPrivacyNotice.suffix")}
    </div>
  ) : null;
};
