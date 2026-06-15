import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { api } from "@/src/utils/api";
import type * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import Header from "@/src/components/layouts/header";
import { usePostHogClientCapture } from "@/src/features/posthog-analytics/usePostHogClientCapture";
import { LockIcon } from "lucide-react";
import { useQueryProject } from "@/src/features/projects/hooks";
import { useSession } from "next-auth/react";
import { useHasProjectAccess } from "@/src/features/rbac/utils/checkProjectAccess";
import { createProjectRetentionSchema } from "@/src/features/auth/lib/projectRetentionSchema";
import { ActionButton } from "@/src/components/ActionButton";
import { useHasEntitlement } from "@/src/features/entitlements/hooks";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export default function ConfigureRetention() {
  const { update: updateSession } = useSession();
  const { project } = useQueryProject();
  const capture = usePostHogClientCapture();
  const { t, translateText } = useI18n();
  const projectRetentionSchema = createProjectRetentionSchema(translateText);
  const hasAccess = useHasProjectAccess({
    projectId: project?.id,
    scope: "project:update",
  });
  const hasEntitlement = useHasEntitlement("data-retention");

  const form = useForm({
    resolver: zodResolver(projectRetentionSchema),
    defaultValues: {
      retention: project?.retentionDays ?? 0,
    },
  });
  const setRetention = api.projects.setRetention.useMutation({
    onSuccess: (_) => {
      updateSession();
    },
    onError: (error) => form.setError("retention", { message: error.message }),
  });

  function onSubmit(values: z.infer<typeof projectRetentionSchema>) {
    if (!hasAccess || !project) return;
    capture("project_settings:retention_form_submit");
    setRetention
      .mutateAsync({
        projectId: project.id,
        retention: values.retention || null, // Fallback to null for indefinite retention
      })
      .then(() => {
        form.reset();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <Header title={t("retention.title")} />
      <Card className="mb-4 p-3">
        <p className="text-primary mb-4 text-sm">
          {t("retention.description")}
        </p>
        {Boolean(form.getValues().retention) &&
        form.getValues().retention !== project?.retentionDays ? (
          <p className="text-primary mb-4 text-sm">
            {t("retention.willChangePrefix")} &quot;
            {project?.retentionDays ?? t("retention.indefinite")}
            &quot; {t("retention.willChangeMiddle")} &quot;
            {Number(form.watch("retention")) === 0
              ? t("retention.indefinite")
              : Number(form.watch("retention"))}
            &quot; {t("retention.daysSuffix")}
          </p>
        ) : !Boolean(project?.retentionDays) ? (
          <p className="text-primary mb-4 text-sm">
            {t("retention.retainsIndefinitely")}
          </p>
        ) : (
          <p className="text-primary mb-4 text-sm">
            {t("retention.currentPrefix")} &quot;
            {project?.retentionDays ?? ""}
            &quot; {t("retention.daysSuffix")}
          </p>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1"
            id="set-retention-project-form"
          >
            <FormField
              control={form.control}
              name="retention"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        step="1"
                        placeholder={project?.retentionDays?.toString() ?? ""}
                        {...field}
                        value={(field.value as number) ?? ""}
                        className="flex-1"
                        disabled={!hasAccess || !hasEntitlement}
                      />
                      {!hasAccess && (
                        <span title={t("apiKeys.accessDenied")}>
                          <LockIcon className="text-muted absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform" />
                        </span>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ActionButton
              variant="secondary"
              hasAccess={hasAccess}
              hasEntitlement={hasEntitlement}
              loading={setRetention.isPending}
              disabled={form.getValues().retention === null}
              className="mt-4"
              type="submit"
            >
              {t("common.save")}
            </ActionButton>
          </form>
        </Form>
      </Card>
    </div>
  );
}
