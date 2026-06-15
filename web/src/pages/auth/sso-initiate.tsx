import { signIn } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ErrorPageWithSentry } from "@/src/components/error-page";
import { Spinner } from "@/src/components/layouts/spinner";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export default function SSOInitiate() {
  const router = useRouter();
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait for router to be ready
    if (!router.isReady) {
      return;
    }

    const provider = router.query.provider as string | undefined;

    // If provider is missing or empty, show error
    if (!provider || provider === "") {
      setError(t("auth.ssoInitiate.missingProvider"));
      return;
    }

    // Automatically trigger sign-in with the provider
    signIn(provider)
      .then(() => {
        // signIn will redirect automatically on success
        // No need to do anything here
      })
      .catch((error) => {
        console.error("SSO initiation error:", error);
        setError(
          error instanceof Error
            ? error.message
            : t("auth.ssoInitiate.failedMessage"),
        );
      });
  }, [router.isReady, router.query.provider, t]);

  // Show error page if sign-in failed
  if (error) {
    return (
      <>
        <Head>
          <title>{t("auth.ssoInitiate.signInErrorTitle")}</title>
        </Head>
        <ErrorPageWithSentry
          title={t("auth.ssoInitiate.failedTitle")}
          message={error}
        />
      </>
    );
  }

  // Show loading spinner while processing
  return (
    <>
      <Head>
        <title>{t("auth.ssoInitiate.loadingTitle")}</title>
      </Head>
      <Spinner message={t("auth.ssoInitiate.loadingMessage")} />
    </>
  );
}
