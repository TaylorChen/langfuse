import { type MultiSelect } from "@/src/components/table/data-table-toolbar";
import { Button } from "@/src/components/ui/button";
import { useI18n } from "@/src/features/i18n/I18nProvider";
import { numberFormatter } from "@/src/utils/numbers";

export function DataTableSelectAllBanner({
  selectAll,
  setSelectAll,
  setRowSelection,
  pageSize,
  totalCount,
}: MultiSelect) {
  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : 0;
  const { t } = useI18n();
  const formattedTotalCount = numberFormatter(totalCount ?? 0, 0);
  const formattedTotalPages = numberFormatter(totalPages, 0);

  return (
    <div className="bg-light-blue/40 dark:bg-light-blue/50 @container mb-2 flex flex-wrap items-center justify-center gap-2 rounded-sm p-2">
      {selectAll ? (
        <span className="text-sm">
          {t("table.allItemsSelected", { count: formattedTotalCount })}{" "}
          <Button
            variant="ghost"
            className="text-accent-dark-blue hover:text-accent-dark-blue/80 h-auto p-0 font-semibold"
            onClick={() => {
              setSelectAll(false);
              setRowSelection({});
            }}
          >
            {t("table.clearSelection")}
          </Button>
        </span>
      ) : (
        <span className="text-sm">
          {t("table.pageItemsSelected", { pageSize: String(pageSize) })}{" "}
          <Button
            variant="ghost"
            className="text-accent-dark-blue hover:text-accent-dark-blue/80 h-auto p-0 font-semibold"
            onClick={() => {
              setSelectAll(true);
            }}
          >
            {t("table.selectAllAcrossPages", {
              totalCount: formattedTotalCount,
              totalPages: formattedTotalPages,
            })}
          </Button>
        </span>
      )}
    </div>
  );
}
