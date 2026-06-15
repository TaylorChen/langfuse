import { DataTable } from "@/src/components/table/data-table";
import { DataTableToolbar } from "@/src/components/table/data-table-toolbar";
import { type LangfuseColumnDef } from "@/src/components/table/types";
import { api } from "@/src/utils/api";
import { type BackgroundMigration } from "@langfuse/shared";
import { RetryBackgroundMigration } from "@/src/features/background-migrations/components/retry-background-migration";
import { StatusBadge } from "@/src/components/layouts/status-badge";
import Page from "@/src/components/layouts/page";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export default function BackgroundMigrationsTable() {
  const { translateText } = useI18n();
  const backgroundMigrations = api.backgroundMigrations.all.useQuery();

  const columns = [
    {
      accessorKey: "name",
      id: "name",
      enableColumnFilter: false,
      header: translateText("Name"),
    },
    {
      accessorKey: "script",
      id: "script",
      enableColumnFilter: false,
      header: translateText("Script"),
    },
    {
      accessorKey: "args",
      id: "args",
      enableColumnFilter: false,
      header: translateText("Args"),
      size: 80,
      cell: (row) => JSON.stringify(row.getValue()),
    },
    {
      id: "status",
      header: translateText("Status"),
      size: 80,
      cell: (row) => {
        const failedAt = row.row.original.failedAt;
        if (failedAt) {
          return <StatusBadge type={"failed"} className="capitalize" />;
        }
        const finishedAt = row.row.original.finishedAt;
        if (finishedAt) {
          return <StatusBadge type={"finished"} className="capitalize" />;
        }
        const workerId = row.row.original.workerId;
        if (workerId) {
          return <StatusBadge type={"active"} className="capitalize" />;
        }

        return <StatusBadge type={"queued"} className="capitalize" />;
      },
    },
    {
      accessorKey: "failedReason",
      id: "failedReason",
      enableColumnFilter: false,
      header: translateText("Failed Reason"),
    },
    {
      accessorKey: "state",
      id: "state",
      enableColumnFilter: false,
      header: translateText("State"),
      cell: (row) => JSON.stringify(row.getValue()),
    },
    {
      id: "actions",
      header: translateText("Actions"),
      size: 65,
      cell: (row) => {
        const name = row.row.original.name;
        const isRetryable = row.row.original.failedAt !== null;
        return (
          <RetryBackgroundMigration
            backgroundMigrationName={name}
            isRetryable={isRetryable}
          />
        );
      },
    },
  ] as LangfuseColumnDef<BackgroundMigration>[];

  return (
    <Page
      headerProps={{
        title: translateText("Background Migrations"),
      }}
    >
      <DataTableToolbar columns={columns} />
      <DataTable
        tableName={"backgroundMigrations"}
        columns={columns}
        data={
          backgroundMigrations.isPending
            ? { isLoading: true, isError: false }
            : backgroundMigrations.isError
              ? {
                  isLoading: false,
                  isError: true,
                  error: backgroundMigrations.error.message,
                }
              : {
                  isLoading: false,
                  isError: false,
                  data: backgroundMigrations.data?.migrations ?? [],
                }
        }
      />
    </Page>
  );
}
