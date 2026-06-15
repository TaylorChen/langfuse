import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useRouter } from "next/router";
import {
  defaultLocale,
  isSupportedLocale,
  messages,
  type SupportedLocale,
  type TranslationKey,
} from "@/src/features/i18n/messages";
import { literalTranslations } from "@/src/features/i18n/literals";

type I18nContextValue = {
  locale: SupportedLocale;
  t: (
    key: TranslationKey,
    values?: Record<string, string | number | undefined>,
  ) => string;
  translateText: (
    text: string,
    values?: Record<string, string | number | undefined>,
  ) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const locale =
    router.locale && isSupportedLocale(router.locale)
      ? router.locale
      : defaultLocale;

  const t = useCallback(
    (
      key: TranslationKey,
      values?: Record<string, string | number | undefined>,
    ) => {
      const message = messages[locale][key] ?? messages[defaultLocale][key];

      if (!values) return message;

      return Object.entries(values).reduce(
        (result, [name, value]) =>
          result.replaceAll(`{${name}}`, String(value ?? "")),
        message,
      );
    },
    [locale],
  );

  const translateText = useCallback(
    (text: string, values?: Record<string, string | number | undefined>) => {
      const message = literalTranslations[locale]?.[text] ?? text;

      if (!values) return message;

      return Object.entries(values).reduce(
        (result, [name, value]) =>
          result.replaceAll(`{${name}}`, String(value ?? "")),
        message,
      );
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, t, translateText }),
    [locale, t, translateText],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
