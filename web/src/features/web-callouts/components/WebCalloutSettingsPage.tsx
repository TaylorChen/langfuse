import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2, Webhook, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { ActionButton } from "@/src/components/ActionButton";
import Header from "@/src/components/layouts/header";
import { StatusBadge } from "@/src/components/layouts/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Switch } from "@/src/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { useI18n } from "@/src/features/i18n/I18nProvider";
import { showErrorToast } from "@/src/features/notifications/showErrorToast";
import { showSuccessToast } from "@/src/features/notifications/showSuccessToast";
import { useHasProjectAccess } from "@/src/features/rbac/utils/checkProjectAccess";
import {
  WEB_CALLOUT_BLOCKED_HEADER_NAMES,
  WEB_CALLOUT_HEADER_NAME_PATTERN,
} from "@/src/features/web-callouts/headerRules";
import { api, type RouterOutputs } from "@/src/utils/api";

type WebCalloutEndpoint = RouterOutputs["webCallouts"]["all"][number];

const createWebCalloutFormSchema = (translateText: (text: string) => string) =>
  z
    .object({
      id: z.string().optional(),
      name: z
        .string()
        .trim()
        .min(1, translateText("Name is required"))
        .max(100, translateText("Name must be at most 100 characters")),
      url: z.url(translateText("Invalid URL")),
      enabled: z.boolean(),
      toastMessage: z
        .string()
        .trim()
        .min(1, translateText("Toast message is required"))
        .max(
          200,
          translateText("Toast message must be at most 200 characters"),
        ),
      headers: z.array(
        z.object({
          name: z.string(),
          value: z.string(),
        }),
      ),
    })
    .superRefine((data, ctx) => {
      const seenHeaderNames = new Set<string>();

      data.headers.forEach((header, index) => {
        const name = header.name.trim();

        if (!name) {
          return;
        }

        const lowerName = name.toLowerCase();

        if (!WEB_CALLOUT_HEADER_NAME_PATTERN.test(name)) {
          ctx.addIssue({
            code: "custom",
            message: translateText("Invalid header name."),
            path: ["headers", index, "name"],
          });
        }

        if (WEB_CALLOUT_BLOCKED_HEADER_NAMES.has(lowerName)) {
          ctx.addIssue({
            code: "custom",
            message: translateText(
              "This header is set by Langfuse and cannot be customized.",
            ),
            path: ["headers", index, "name"],
          });
        }

        if (seenHeaderNames.has(lowerName)) {
          ctx.addIssue({
            code: "custom",
            message: translateText("Header names must be unique."),
            path: ["headers", index, "name"],
          });
        }

        seenHeaderNames.add(lowerName);
      });
    });

type WebCalloutFormValues = z.infer<
  ReturnType<typeof createWebCalloutFormSchema>
>;

export function WebCalloutSettingsPage(props: { projectId: string }) {
  const { t } = useI18n();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEndpoint, setEditingEndpoint] =
    useState<WebCalloutEndpoint | null>(null);

  const hasAccess = useHasProjectAccess({
    projectId: props.projectId,
    scope: "integrations:CRUD",
  });

  const endpoints = api.webCallouts.all.useQuery(
    { projectId: props.projectId },
    { enabled: hasAccess },
  );
  const utils = api.useUtils();

  const deleteMutation = api.webCallouts.delete.useMutation({
    onSuccess: async () => {
      await utils.webCallouts.invalidate();
      showSuccessToast({
        title: t("webCallouts.endpointDeleted"),
        description: t("webCallouts.endpointDeletedDescription"),
      });
    },
    onError: (error) => {
      showErrorToast(t("webCallouts.deleteFailed"), error.message);
    },
  });

  if (!hasAccess) {
    return (
      <div>
        <Header title={t("webCallouts.title")} />
        <Alert>
          <AlertTitle>{t("common.accessDenied")}</AlertTitle>
          <AlertDescription>{t("webCallouts.noPermission")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const configuredEndpoint = endpoints.data?.[0];
  const canCreateEndpoint = !configuredEndpoint;

  const openCreateDialog = () => {
    setEditingEndpoint(null);
    setDialogOpen(true);
  };

  const openEditDialog = (endpoint: WebCalloutEndpoint) => {
    setEditingEndpoint(endpoint);
    setDialogOpen(true);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-2">
        <Header title={t("webCallouts.title")} />
        <WebCalloutEndpointDialog
          projectId={props.projectId}
          endpoint={editingEndpoint}
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditingEndpoint(null);
            }
          }}
          trigger={
            <Button
              disabled={!canCreateEndpoint || endpoints.isLoading}
              onClick={openCreateDialog}
            >
              <Plus className="mr-1 h-4 w-4" />
              {t("webCallouts.addEndpoint")}
            </Button>
          }
        />
      </div>

      <p className="text-primary mb-4 text-sm">
        {t("webCallouts.description")}
      </p>

      <Card className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-primary">
                {t("webCallouts.endpoint")}
              </TableHead>
              <TableHead className="text-primary">
                {t("webCallouts.behavior")}
              </TableHead>
              <TableHead className="text-primary">
                {t("webCallouts.headers")}
              </TableHead>
              <TableHead className="text-primary">
                {t("common.status")}
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {endpoints.data?.length === 0 ? (
              <TableRow>
                <TableCell
                  density="comfortable"
                  colSpan={5}
                  className="text-muted-foreground text-center"
                >
                  {t("webCallouts.noEndpoint")}
                </TableCell>
              </TableRow>
            ) : (
              endpoints.data?.map((endpoint) => (
                <TableRow key={endpoint.id}>
                  <TableCell
                    density="comfortable"
                    className="max-w-xl font-mono break-all"
                  >
                    {endpoint.url}
                  </TableCell>
                  <TableCell density="comfortable">
                    <BehaviorSummary endpoint={endpoint} />
                  </TableCell>
                  <TableCell density="comfortable">
                    <HeaderList endpoint={endpoint} />
                  </TableCell>
                  <TableCell density="comfortable">
                    <StatusBadge
                      type={endpoint.enabled ? "active" : "disabled"}
                      showText={false}
                    >
                      {endpoint.enabled
                        ? t("common.active")
                        : t("common.disabled")}
                    </StatusBadge>
                  </TableCell>
                  <TableCell density="comfortable" className="text-right">
                    <div className="flex justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(endpoint)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {t("webCallouts.editEndpoint")}
                        </TooltipContent>
                      </Tooltip>
                      <DeleteEndpointButton
                        endpoint={endpoint}
                        onDelete={(id) => {
                          deleteMutation.mutate({
                            projectId: props.projectId,
                            id,
                          });
                        }}
                        loading={deleteMutation.isPending}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function HeaderList(props: { endpoint: WebCalloutEndpoint }) {
  const { t } = useI18n();
  const headers = props.endpoint.requestHeaderKeys;

  if (headers.length === 0) {
    return <span className="text-muted-foreground">{t("common.none")}</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {headers.map((name) => (
        <code key={name}>{name}</code>
      ))}
    </div>
  );
}

function BehaviorSummary(props: { endpoint: WebCalloutEndpoint }) {
  const { t } = useI18n();
  const displayToastMessage =
    props.endpoint.toastMessage === "Callout sent"
      ? t("webCallouts.defaultToastMessage")
      : props.endpoint.toastMessage;

  return (
    <div className="space-y-1 text-sm">
      <div className="max-w-xs truncate" title={displayToastMessage}>
        {displayToastMessage}
      </div>
      <div className="text-muted-foreground">
        {t("webCallouts.backendTimeout")}
      </div>
    </div>
  );
}

function WebCalloutEndpointDialog(props: {
  projectId: string;
  endpoint: WebCalloutEndpoint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
}) {
  const { t, translateText } = useI18n();
  const utils = api.useUtils();
  const upsertMutation = api.webCallouts.upsert.useMutation({
    onSuccess: async () => {
      await utils.webCallouts.invalidate();
      showSuccessToast({
        title: props.endpoint
          ? t("webCallouts.endpointUpdated")
          : t("webCallouts.endpointCreated"),
        description: t("webCallouts.saved"),
      });
      props.onOpenChange(false);
    },
    onError: (error) => {
      showErrorToast(t("webCallouts.saveFailed"), error.message);
    },
  });

  const webCalloutFormSchema = useMemo(
    () => createWebCalloutFormSchema(translateText),
    [translateText],
  );

  const form = useForm<WebCalloutFormValues>({
    resolver: zodResolver(webCalloutFormSchema),
    defaultValues: endpointToFormValues(props.endpoint, {
      defaultName: t("webCallouts.defaultEndpointName"),
      defaultToastMessage: t("webCallouts.defaultToastMessage"),
    }),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "headers",
  });

  useEffect(() => {
    if (props.open) {
      form.reset(
        endpointToFormValues(props.endpoint, {
          defaultName: t("webCallouts.defaultEndpointName"),
          defaultToastMessage: t("webCallouts.defaultToastMessage"),
        }),
      );
    }
  }, [form, props.endpoint, props.open, t]);

  const onSubmit = (values: WebCalloutFormValues) => {
    upsertMutation.mutate({
      projectId: props.projectId,
      id: values.id,
      name: values.name,
      url: values.url,
      enabled: values.enabled,
      toastMessage: values.toastMessage,
      requestHeaders: formValuesToRequestHeaders(values),
    });
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>
            {props.endpoint
              ? t("webCallouts.editTitle")
              : t("webCallouts.addTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("webCallouts.dialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogBody>
              <Alert>
                <AlertTitle>{t("webCallouts.backendRequirements")}</AlertTitle>
                <AlertDescription className="space-y-3">
                  <p>
                    {t("webCallouts.backendRequirementPostPrefix")}{" "}
                    <code>POST</code>{" "}
                    {t("webCallouts.backendRequirementPostMiddle")}{" "}
                    <code>Content-Type: application/json</code>{" "}
                    {t("webCallouts.backendRequirementPostSuffix")}
                  </p>
                  <p>{t("webCallouts.backendRequirementHeaders")}</p>
                  <p>
                    {t("webCallouts.backendRequirementEncryptionPrefix")}{" "}
                    <code>http://</code>
                    {t("webCallouts.backendRequirementEncryptionSuffix")}
                  </p>
                </AlertDescription>
              </Alert>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.name")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("webCallouts.endpointUrl")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/langfuse/callout"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("webCallouts.endpointUrlDescription")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <FormLabel>{t("common.enabled")}</FormLabel>
                      <FormDescription>
                        {t("webCallouts.enabledDescription")}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toastMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("webCallouts.toastMessage")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      {t("webCallouts.toastMessageDescription")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>{t("webCallouts.headers")}</FormLabel>
                <FormDescription className="mb-2">
                  {t("webCallouts.headersDescription")}
                </FormDescription>
                <div className="space-y-2">
                  {fields.map((field, index) => {
                    const currentHeaderName = form.watch(
                      `headers.${index}.name`,
                    );
                    const preservesExistingValue = hasExistingHeaderName(
                      props.endpoint,
                      currentHeaderName,
                    );

                    return (
                      <div
                        key={field.id}
                        className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-start gap-2"
                      >
                        <FormField
                          control={form.control}
                          name={`headers.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder={t("webCallouts.headerName")}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`headers.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder={
                                    preservesExistingValue
                                      ? "***"
                                      : t("webCallouts.headerValue")
                                  }
                                  type="password"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t("webCallouts.removeHeader")}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    );
                  })}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={() =>
                    append({
                      name: "",
                      value: "",
                    })
                  }
                >
                  <Plus className="mr-1 h-4 w-4" />
                  {t("webCallouts.addHeader")}
                </Button>
              </div>
            </DialogBody>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => props.onOpenChange(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" loading={upsertMutation.isPending}>
                {t("webCallouts.saveEndpoint")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteEndpointButton(props: {
  endpoint: WebCalloutEndpoint;
  onDelete: (id: string) => void;
  loading: boolean;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>{t("webCallouts.deleteEndpoint")}</TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("webCallouts.deleteTitle")}</DialogTitle>
          <DialogDescription>
            {t("webCallouts.deleteDescription")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            loading={props.loading}
            onClick={() => {
              props.onDelete(props.endpoint.id);
              setOpen(false);
            }}
          >
            {t("webCallouts.deleteEndpoint")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const endpointToFormValues = (
  endpoint: WebCalloutEndpoint | null,
  defaults: {
    defaultName: string;
    defaultToastMessage: string;
  },
): WebCalloutFormValues => ({
  id: endpoint?.id,
  name: endpoint?.name ?? defaults.defaultName,
  url: endpoint?.url ?? "",
  enabled: endpoint?.enabled ?? true,
  toastMessage: endpoint?.toastMessage ?? defaults.defaultToastMessage,
  headers: (endpoint?.requestHeaderKeys ?? []).map((name) => ({
    name,
    value: "",
  })),
});

const formValuesToRequestHeaders = (
  values: WebCalloutFormValues,
): Record<string, string> =>
  Object.fromEntries(
    values.headers
      .filter((header) => header.name.trim())
      .map((header) => [header.name.trim(), header.value.trim()]),
  );

const hasExistingHeaderName = (
  endpoint: WebCalloutEndpoint | null,
  name: string,
) => {
  const normalizedName = name.trim().toLowerCase();
  if (!normalizedName) {
    return false;
  }

  return (
    endpoint?.requestHeaderKeys.some(
      (headerName) => headerName.toLowerCase() === normalizedName,
    ) ?? false
  );
};

export function WebCalloutIntegrationCard(props: {
  projectId: string;
  hasAccess: boolean;
}) {
  const { t } = useI18n();
  const availability = api.webCallouts.availability.useQuery(
    { projectId: props.projectId },
    { staleTime: 60_000 },
  );

  if (availability.data?.enabled !== true) {
    return null;
  }

  return (
    <Card className="p-3">
      <div className="mb-4 flex items-center gap-2">
        <Webhook className="text-foreground h-5 w-5" />
        <span className="font-semibold">{t("webCallouts.title")}</span>
      </div>
      <p className="text-primary mb-4 text-sm">
        {t("webCallouts.cardDescription")}
      </p>
      <ActionButton
        variant="secondary"
        hasAccess={props.hasAccess}
        href={`/project/${props.projectId}/settings/integrations/web-callouts`}
      >
        {t("common.configure")}
      </ActionButton>
    </Card>
  );
}
