import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableCellWithCopyButton,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import Header from "@/src/components/layouts/header";
import { useI18n } from "@/src/features/i18n/I18nProvider";
import { useHasEntitlement } from "@/src/features/entitlements/hooks";
import { showErrorToast } from "@/src/features/notifications/showErrorToast";
import { showSuccessToast } from "@/src/features/notifications/showSuccessToast";
import { useHasOrganizationAccess } from "@/src/features/rbac/utils/checkOrganizationAccess";
import { api } from "@/src/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ChevronRight, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type TranslateText = (
  text: string,
  values?: Record<string, string | number | undefined>,
) => string;

const createAddDomainSchema = (translateText: TranslateText) =>
  z.object({
    domain: z
      .string()
      .trim()
      .min(3)
      .max(253)
      .transform((v) => v.toLowerCase())
      .refine(
        (v) =>
          /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/.test(
            v,
          ),
        { message: translateText("Must be a valid domain (e.g. acme.com)") },
      ),
  });

type AddDomainInput = { domain: string };

export const VerifiedDomainsSettings = ({ orgId }: { orgId: string }) => {
  const { translateText } = useI18n();
  const hasEntitlement = useHasEntitlement("cloud-multi-tenant-sso");
  const hasAccess = useHasOrganizationAccess({
    organizationId: orgId,
    scope: "organization:update",
  });

  const heading = (
    <>
      <Header title={translateText("Verified Domains")} />
      <p className="text-muted-foreground mb-4 text-sm">
        {translateText(
          "You can only configure SSO for domains your organization owns. Verify a domain via DNS to enable SSO for it.",
        )}
      </p>
    </>
  );

  if (!hasEntitlement) {
    return (
      <div>
        {heading}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{translateText("Not available")}</AlertTitle>
          <AlertDescription>
            {translateText(
              "Verified Domains and Enterprise SSO are not available on your plan. Please upgrade to access this feature.",
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div>
        {heading}
        <Alert>
          <AlertTitle>{translateText("Access Denied")}</AlertTitle>
          <AlertDescription>
            {translateText(
              "You do not have permission to manage verified domains for this organization.",
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header
        title={translateText("Verified Domains")}
        actionButtons={<AddDomainButton orgId={orgId} />}
      />
      <p className="text-muted-foreground text-sm">
        {translateText(
          "You can only configure SSO for domains your organization owns. Verify a domain via DNS to enable SSO for it.",
        )}
      </p>
      <DomainsTable orgId={orgId} />
    </div>
  );
};

function DomainsTable({ orgId }: { orgId: string }) {
  const { translateText } = useI18n();
  const query = api.verifiedDomain.list.useQuery({ orgId });

  return (
    <Card className="mb-4 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-primary pl-2.5">
              {translateText("Domain")}
            </TableHead>
            <TableHead className="text-primary">
              {translateText("Status")}
            </TableHead>
            <TableHead className="text-primary hidden md:table-cell">
              {translateText("Added")}
            </TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody className="text-muted-foreground">
          {query.data && query.data.length === 0 ? (
            <TableRow>
              <TableCell
                density="comfortable"
                colSpan={4}
                className="py-12 text-center text-sm"
              >
                {translateText("No domains added yet")}
              </TableCell>
            </TableRow>
          ) : (
            query.data?.map((row) => (
              <DomainRow key={row.id} orgId={orgId} row={row} />
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

type DomainRowData = {
  id: string;
  domain: string;
  verifiedAt: Date | null;
  createdAt: Date;
  recordHost: string;
  recordValue: string;
};

function DomainRow({ orgId, row }: { orgId: string; row: DomainRowData }) {
  const { translateText } = useI18n();
  const [expanded, setExpanded] = useState(!row.verifiedAt);
  const utils = api.useUtils();

  const verifyMutation = api.verifiedDomain.verify.useMutation({
    onSuccess: () => {
      utils.verifiedDomain.list.invalidate({ orgId });
      utils.ssoConfig.get.invalidate({ orgId });
      showSuccessToast({
        title: translateText("Domain verified"),
        description: translateText("{domain} is now verified.", {
          domain: row.domain,
        }),
      });
    },
    onError: (err) => {
      showErrorToast(translateText("Verification failed"), err.message);
    },
  });

  return (
    <>
      <TableRow className="hover:bg-primary-foreground">
        <TableCell density="comfortable" className="font-mono">
          {!row.verifiedAt ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1"
            >
              <ChevronRight
                className={`h-3 w-3 transition-transform ${
                  expanded ? "rotate-90" : ""
                }`}
              />
              {row.domain}
            </button>
          ) : (
            row.domain
          )}
        </TableCell>
        <TableCell density="comfortable">
          {row.verifiedAt ? (
            <Badge variant="default">{translateText("Verified")}</Badge>
          ) : (
            <Badge variant="secondary">
              {translateText("Pending verification")}
            </Badge>
          )}
        </TableCell>
        <TableCell density="comfortable" className="hidden md:table-cell">
          {row.createdAt.toLocaleDateString()}
        </TableCell>
        <TableCell
          density="comfortable"
          className="flex items-center justify-end gap-2"
        >
          {!row.verifiedAt && (
            <Button
              size="sm"
              onClick={() => verifyMutation.mutate({ orgId, id: row.id })}
              loading={verifyMutation.isPending}
            >
              {translateText("Verify")}
            </Button>
          )}
          <DeleteDomainButton
            orgId={orgId}
            id={row.id}
            domain={row.domain}
            verified={Boolean(row.verifiedAt)}
          />
        </TableCell>
      </TableRow>
      {!row.verifiedAt && expanded && (
        <TableRow className="bg-muted/30">
          <TableCell colSpan={4} className="py-4">
            <DnsInstructions
              recordHost={row.recordHost}
              recordValue={row.recordValue}
            />
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function DnsInstructions({
  recordHost,
  recordValue,
}: {
  recordHost: string;
  recordValue: string;
}) {
  const { translateText } = useI18n();

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">
        {translateText("Add the following TXT record to your DNS provider:")}
      </p>
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">{translateText("Type")}</TableHead>
              <TableHead className="w-54">{translateText("Host")}</TableHead>
              <TableHead>{translateText("Value")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell density="comfortable" className="w-16 font-mono">
                TXT
              </TableCell>
              <TableCellWithCopyButton
                density="comfortable"
                text={recordHost}
                className="w-54 py-3 font-mono break-all"
              />
              <TableCellWithCopyButton
                density="comfortable"
                text={recordValue}
                className="py-3 font-mono break-all"
              />
            </TableRow>
          </TableBody>
        </Table>
      </Card>
      <p className="text-muted-foreground text-xs">
        {translateText(
          "DNS changes may take up to 24h to propagate. After adding the record, click Verify.",
        )}
      </p>
    </div>
  );
}

function AddDomainButton({ orgId }: { orgId: string }) {
  const { translateText } = useI18n();
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();

  const form = useForm<AddDomainInput>({
    resolver: zodResolver(createAddDomainSchema(translateText)),
    defaultValues: { domain: "" },
  });

  const createMutation = api.verifiedDomain.create.useMutation({
    onSuccess: () => {
      utils.verifiedDomain.list.invalidate({ orgId });
      showSuccessToast({
        title: translateText("Domain added"),
        description: translateText(
          "Add the DNS TXT record shown in the table, then click Verify.",
        ),
      });
      form.reset();
      setOpen(false);
    },
    onError: (err) => {
      form.setError("domain", { message: err.message });
    },
  });

  function onSubmit(values: AddDomainInput) {
    createMutation.mutate({ orgId, domain: values.domain });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">{translateText("Add Domain")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{translateText("Add a domain")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogBody>
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translateText("Domain")}</FormLabel>
                    <FormControl>
                      <Input placeholder="acme.com" autoFocus {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogBody>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                {translateText("Cancel")}
              </Button>
              <Button type="submit" loading={createMutation.isPending}>
                {translateText("Add")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDomainButton({
  orgId,
  id,
  domain,
  verified,
}: {
  orgId: string;
  id: string;
  domain: string;
  verified: boolean;
}) {
  const { translateText } = useI18n();
  const utils = api.useUtils();

  const deleteMutation = api.verifiedDomain.delete.useMutation({
    onSuccess: () => {
      utils.verifiedDomain.list.invalidate({ orgId });
      showSuccessToast({
        title: translateText("Domain removed"),
        description: translateText("{domain} has been removed.", { domain }),
      });
    },
    onError: (err) => {
      showErrorToast(translateText("Failed to remove domain"), err.message);
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={translateText("Delete {domain}", { domain })}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {translateText("Remove {domain}?", { domain })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {verified
              ? translateText(
                  "If an SSO configuration exists for this domain, you must remove it first. The domain can be re-verified later.",
                )
              : translateText(
                  "This removes the pending claim. The domain can be re-added and verified later.",
                )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{translateText("Cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutate({ orgId, id })}
            disabled={deleteMutation.isPending}
          >
            {translateText("Remove")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
