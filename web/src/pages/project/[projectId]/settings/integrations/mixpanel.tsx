import { MixpanelLogo } from "@/src/components/MixpanelLogo";
import Header from "@/src/components/layouts/header";
import ContainerPage from "@/src/components/layouts/container-page";
import { StatusBadge } from "@/src/components/layouts/status-badge";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { PasswordInput } from "@/src/components/ui/password-input";
import { Switch } from "@/src/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/src/components/ui/tooltip";
import { usePostHogClientCapture } from "@/src/features/posthog-analytics/usePostHogClientCapture";
import {
  createMixpanelIntegrationFormSchema,
  MIXPANEL_REGIONS,
  type MixpanelRegion,
} from "@/src/features/mixpanel-integration/types";
import {
  AnalyticsIntegrationExportSource,
  EXPORT_SOURCE_OPTIONS,
  isLegacyBlobExportAllowed,
} from "@langfuse/shared";
import { useV4Beta } from "@/src/features/events/hooks/useV4Beta";
import { useLangfuseCloudRegion } from "@/src/features/organizations/hooks";
import { useQueryProject } from "@/src/features/projects/hooks";
import { useHasProjectAccess } from "@/src/features/rbac/utils/checkProjectAccess";
import { api } from "@/src/utils/api";
import { type RouterOutput } from "@/src/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/src/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { Info, ExternalLink } from "lucide-react";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export default function MixpanelIntegrationSettings() {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const { t, translateText } = useI18n();

  const hasAccess = useHasProjectAccess({
    projectId,
    scope: "integrations:CRUD",
  });
  const state = api.mixpanelIntegration.get.useQuery(
    { projectId },
    {
      enabled: hasAccess,
    },
  );

  const status =
    state.isLoading || !hasAccess
      ? undefined
      : state.data?.enabled
        ? "active"
        : "inactive";

  return (
    <ContainerPage
      headerProps={{
        title: t("analyticsIntegrations.mixpanelTitle"),
        breadcrumb: [
          {
            name: translateText("Settings"),
            href: `/project/${projectId}/settings`,
          },
        ],
        actionButtonsLeft: (
          <>
            {status && (
              <StatusBadge type={status} showText={false}>
                <span>{translateText(status)}</span>
              </StatusBadge>
            )}
          </>
        ),
        actionButtonsRight: (
          <Button asChild variant="secondary">
            <Link href="https://langfuse.com/integrations/analytics/mixpanel">
              {t("integrations.docs")}
            </Link>
          </Button>
        ),
      }}
    >
      <p className="text-primary mb-4 text-sm">
        {t("analyticsIntegrations.mixpanelIntroPrefix")}{" "}
        <Link href="https://mixpanel.com" className="underline">
          Mixpanel
        </Link>{" "}
        {t("analyticsIntegrations.mixpanelIntroSuffix")}
      </p>
      {!hasAccess && (
        <p className="text-sm">{t("analyticsIntegrations.noAccess")}</p>
      )}
      {hasAccess && (
        <>
          <Header title={translateText("Configuration")} />
          <Card className="p-3">
            <MixpanelLogo className="text-foreground mb-4 w-20" />
            <MixpanelIntegrationSettingsForm
              state={state.data}
              projectId={projectId}
              isLoading={state.isLoading}
            />
          </Card>
        </>
      )}
      {state.data?.enabled && (
        <>
          <Header title={translateText("Status")} className="mt-8" />
          <p className="text-primary text-sm">
            {t("analyticsIntegrations.dataSyncedUntil")}{" "}
            {state.data?.lastSyncAt
              ? new Date(state.data.lastSyncAt).toLocaleString()
              : t("analyticsIntegrations.neverPending")}
          </p>
        </>
      )}
    </ContainerPage>
  );
}

const MixpanelIntegrationSettingsForm = ({
  state,
  projectId,
  isLoading,
}: {
  state?: RouterOutput["mixpanelIntegration"]["get"];
  projectId: string;
  isLoading: boolean;
}) => {
  const capture = usePostHogClientCapture();
  const { t, translateText } = useI18n();
  const { isBetaEnabled } = useV4Beta();
  const { isLangfuseCloud } = useLangfuseCloudRegion();
  const { project } = useQueryProject();
  const formSchema = createMixpanelIntegrationFormSchema(translateText);

  // Post-cutoff Cloud projects may only use OBSERVATIONS_V2 (EVENTS). The
  // Export Source field is hidden in that case; the form value is pinned to
  // EVENTS via the default below. Mirrors blob-storage settings (LFE-9688 / 9830).
  const isPostCutoffCloud =
    project?.createdAt != null &&
    !isLegacyBlobExportAllowed(new Date(project.createdAt), isLangfuseCloud);
  const showExportSourceField = isBetaEnabled && !isPostCutoffCloud;

  const mixpanelForm = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mixpanelRegion:
        (state?.mixpanelRegion as MixpanelRegion) ??
        MIXPANEL_REGIONS[0].subdomain,
      mixpanelProjectToken: state?.mixpanelProjectToken ?? "",
      enabled: state?.enabled ?? false,
      exportSource: isPostCutoffCloud
        ? AnalyticsIntegrationExportSource.EVENTS
        : (state?.exportSource ??
          (isBetaEnabled
            ? AnalyticsIntegrationExportSource.EVENTS
            : AnalyticsIntegrationExportSource.TRACES_OBSERVATIONS)),
    },
    disabled: isLoading,
  });

  useEffect(() => {
    mixpanelForm.reset({
      mixpanelRegion:
        (state?.mixpanelRegion as MixpanelRegion) ??
        MIXPANEL_REGIONS[0].subdomain,
      mixpanelProjectToken: state?.mixpanelProjectToken ?? "",
      enabled: state?.enabled ?? false,
      exportSource: isPostCutoffCloud
        ? AnalyticsIntegrationExportSource.EVENTS
        : (state?.exportSource ??
          (isBetaEnabled
            ? AnalyticsIntegrationExportSource.EVENTS
            : AnalyticsIntegrationExportSource.TRACES_OBSERVATIONS)),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const utils = api.useUtils();
  const mut = api.mixpanelIntegration.update.useMutation({
    onSuccess: () => {
      utils.mixpanelIntegration.invalidate();
    },
  });
  const mutDelete = api.mixpanelIntegration.delete.useMutation({
    onSuccess: () => {
      utils.mixpanelIntegration.invalidate();
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    capture("integrations:mixpanel_form_submitted");
    mut.mutate({
      projectId,
      ...values,
    });
  }

  return (
    <Form {...mixpanelForm}>
      <form
        className="space-y-3"
        onSubmit={mixpanelForm.handleSubmit(onSubmit)}
      >
        <FormField
          control={mixpanelForm.control}
          name="mixpanelRegion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("analyticsIntegrations.mixpanelRegion")}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("analyticsIntegrations.selectRegion")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {MIXPANEL_REGIONS.map((region) => (
                    <SelectItem key={region.subdomain} value={region.subdomain}>
                      {region.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                {t("analyticsIntegrations.mixpanelRegionDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={mixpanelForm.control}
          name="mixpanelProjectToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("analyticsIntegrations.mixpanelProjectToken")}
              </FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormDescription>
                {t("analyticsIntegrations.mixpanelProjectTokenDescription")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {showExportSourceField && (
          <FormField
            control={mixpanelForm.control}
            name="exportSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1.5 pt-2">
                  {t("analyticsIntegrations.exportSource")}
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="text-muted-foreground h-3.5 w-3.5" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="max-w-[350px] space-y-2 p-3"
                    >
                      {EXPORT_SOURCE_OPTIONS.map((option) => (
                        <div key={option.value} className="space-y-0.5">
                          <div className="font-medium">
                            {translateText(option.label)}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {translateText(option.description)}
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-2">
                        <a
                          href="https://langfuse.com/docs/integrations/export-sources"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary inline-flex items-center gap-1 text-xs hover:underline"
                        >
                          {t("analyticsIntegrations.exportSourceLearnMore")}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          "analyticsIntegrations.selectDataToExport",
                        )}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EXPORT_SOURCE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {translateText(option.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {t("analyticsIntegrations.mixpanelExportSourceDescription")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={mixpanelForm.control}
          name="enabled"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translateText("Enabled")}</FormLabel>
              <FormControl>
                <Switch
                  id="mixpanel-integration-enabled"
                  checked={field.value}
                  onCheckedChange={() => {
                    field.onChange(!field.value);
                  }}
                  className="mt-1 ml-4"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <div className="mt-8 flex gap-2">
        <Button
          loading={mut.isPending}
          onClick={mixpanelForm.handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {translateText("Save")}
        </Button>
        <Button
          variant="ghost"
          loading={mutDelete.isPending}
          disabled={isLoading || !!!state}
          onClick={() => {
            if (confirm(t("analyticsIntegrations.resetMixpanelConfirm")))
              mutDelete.mutate({ projectId });
          }}
        >
          {translateText("Reset")}
        </Button>
      </div>
    </Form>
  );
};
