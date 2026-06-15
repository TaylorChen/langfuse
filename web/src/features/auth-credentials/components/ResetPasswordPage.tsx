import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Head from "next/head";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { PasswordInput } from "@/src/components/ui/password-input";
import { LangfuseIcon } from "@/src/components/LangfuseLogo";
import { useSession } from "next-auth/react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { api } from "@/src/utils/api";
import { useRouter } from "next/router";
import { RequestResetPasswordEmailButton } from "@/src/features/auth-credentials/components/ResetPasswordButton";
import { TRPCClientError } from "@trpc/client";
import { isEmailVerifiedWithinCutoff } from "@/src/features/auth-credentials/lib/credentialsUtils";
import Link from "next/link";
import { ErrorPage } from "@/src/components/error-page";
import { usePostHogClientCapture } from "@/src/features/posthog-analytics/usePostHogClientCapture";
import { createPasswordSchema } from "@/src/features/auth/lib/signupSchema";
import { useLangfuseCloudRegion } from "@/src/features/organizations/hooks";
import { useI18n } from "@/src/features/i18n/I18nProvider";

const createResetPasswordSchema = (translateText: (text: string) => string) =>
  z
    .object({
      email: z.email(translateText("Invalid email address")),
      password: createPasswordSchema(translateText),
      confirmPassword: createPasswordSchema(translateText),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: translateText("Passwords do not match"),
      path: ["confirmPassword"],
    });

export function ResetPasswordPage({
  passwordResetAvailable,
}: {
  passwordResetAvailable: boolean;
}) {
  const session = useSession();
  const router = useRouter();
  const { isLangfuseCloud, region } = useLangfuseCloudRegion();
  const { t, translateText } = useI18n();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showResetPasswordEmailButton, setShowResetPasswordEmailButton] =
    useState(false);

  const capture = usePostHogClientCapture();
  const resetPasswordSchema = useMemo(
    () => createResetPasswordSchema(translateText),
    [translateText],
  );

  // Detect set mode: user exists but has no password (signup email verification flow)
  const isSetMode = session.data?.user?.hasPassword === false;

  const mutResetPassword = api.credentials.resetPassword.useMutation();
  const emailVerified = isEmailVerifiedWithinCutoff(
    session.data?.user?.emailVerified,
  );

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: session.data?.user?.email ?? "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    setFormError(null);
    setShowResetPasswordEmailButton(false);
    setIsSuccess(false);
    capture(
      isSetMode
        ? "auth:set_password_form_submit"
        : "auth:update_password_form_submit",
    );
    await mutResetPassword
      .mutateAsync({ password: values.password })
      .then(() => {
        setIsSuccess(true);
        setTimeout(() => {
          const target =
            isSetMode && isLangfuseCloud && region !== "DEV"
              ? "/onboarding"
              : "/";
          router.push(target);
          setIsSuccess(false);
        }, 2000);
      })
      .catch((error) => {
        console.log(error.message);
        if (error instanceof TRPCClientError) {
          if (error.data?.code === "UNAUTHORIZED") {
            setShowResetPasswordEmailButton(true);
          }
          setFormError(error.message);
        } else {
          console.error(error);
          setFormError(t("auth.resetPassword.unknownError"));
        }
      });
  }

  if (!passwordResetAvailable)
    return (
      <ErrorPage
        title={t("auth.resetPassword.notAvailableTitle")}
        message={t("auth.resetPassword.notAvailableMessage")}
        additionalButton={{
          label: t("auth.resetPassword.setupInstructions"),
          href: "https://langfuse.com/self-hosting/security/authentication-and-sso#auth-email-password",
        }}
      />
    );

  const title = isSetMode
    ? t("auth.resetPassword.setTitle")
    : t("auth.resetPassword.resetTitle");
  const pageTitle = isSetMode
    ? t("auth.resetPassword.setPageTitle")
    : t("auth.resetPassword.resetPageTitle");
  const submitLabel = isSetMode
    ? t("auth.resetPassword.setSubmit")
    : t("auth.resetPassword.updateSubmit");
  const successMessage = isSetMode
    ? t("auth.resetPassword.setSuccess")
    : t("auth.resetPassword.updateSuccess");

  return (
    <>
      <Head>
        <title>{pageTitle} | Langfuse</title>
      </Head>
      <div className="flex flex-1 flex-col py-6 sm:min-h-full sm:justify-center sm:px-6 sm:py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/">
            <LangfuseIcon className="mx-auto" />
          </Link>
          <h2 className="text-primary mt-4 text-center text-2xl leading-9 font-bold tracking-tight">
            {title}
          </h2>
          {!isSetMode && session.status !== "authenticated" && (
            <div className="mt-2 flex justify-center">
              <Button asChild variant="ghost">
                <Link href="/auth/sign-in">
                  <ArrowLeft className="mr-2 h-3 w-3" />
                  {t("auth.resetPassword.backToSignIn")}
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="bg-background mt-10 px-6 py-10 shadow-sm sm:mx-auto sm:w-full sm:max-w-[480px] sm:rounded-lg sm:px-12">
          <div className="space-y-6">
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("auth.resetPassword.emailLabel")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="jsdoe@example.com"
                            disabled={session.status === "authenticated"}
                            allowPasswordManager
                            autoComplete="email"
                            {...field}
                          />
                          {emailVerified.verified && (
                            <span title={t("auth.resetPassword.emailVerified")}>
                              <ShieldCheck className="text-muted-green absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 transform" />
                            </span>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {emailVerified.verified && (
                  <>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {isSetMode
                              ? t("auth.resetPassword.passwordLabel")
                              : t("auth.resetPassword.newPasswordLabel")}
                          </FormLabel>
                          <FormControl>
                            <PasswordInput
                              autoComplete="new-password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {isSetMode
                              ? t("auth.resetPassword.confirmPasswordLabel")
                              : t("auth.resetPassword.confirmNewPasswordLabel")}
                          </FormLabel>
                          <FormControl>
                            <PasswordInput
                              autoComplete="new-password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <div className="pt-4">
                  {emailVerified.verified ? (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={mutResetPassword.isPending}
                      loading={mutResetPassword.isPending}
                      variant={
                        showResetPasswordEmailButton ? "secondary" : "default"
                      }
                    >
                      {submitLabel}
                    </Button>
                  ) : (
                    <RequestResetPasswordEmailButton
                      email={form.watch("email")}
                      className="w-full"
                      callbackUrl={
                        isSetMode ? "/auth/setup-password" : undefined
                      }
                    />
                  )}
                </div>
              </form>
            </Form>
            {formError ? (
              <div className="text-destructive text-center text-sm font-medium">
                {formError}
              </div>
            ) : null}
            {isSuccess && (
              <div className="text-center text-sm font-medium">
                {successMessage}
              </div>
            )}
            {showResetPasswordEmailButton && (
              <RequestResetPasswordEmailButton
                email={form.getValues("email")}
                className="w-full"
                callbackUrl={isSetMode ? "/auth/setup-password" : undefined}
              />
            )}
          </div>
        </div>
        {!isSetMode && session.status !== "authenticated" && (
          <div className="text-muted-foreground mx-auto mt-10 max-w-lg text-center text-xs">
            {t("auth.resetPassword.emailNotice")}{" "}
            <Link href="/auth/sign-in" className="underline">
              {t("auth.resetPassword.emailNoticeSignIn")}
            </Link>
            .
          </div>
        )}
      </div>
    </>
  );
}
