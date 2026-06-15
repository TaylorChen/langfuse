import { useState } from "react";
import { CheckIcon, ChevronDown } from "lucide-react";

import Spinner from "@/src/components/design-system/Spinner/Spinner";
import { Button } from "@/src/components/ui/button";
import {
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  InputCommand,
  InputCommandEmpty,
  InputCommandGroup,
  InputCommandInput,
  InputCommandItem,
  InputCommandList,
} from "@/src/components/ui/input-command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Skeleton } from "@/src/components/ui/skeleton";
import { cn } from "@/src/utils/tailwind";
import { api } from "@/src/utils/api";
import { useI18n } from "@/src/features/i18n/I18nProvider";

type DatasetOption = {
  id: string;
  name: string;
};

export const RemoteExperimentDatasetStep = ({
  projectId,
  initialDatasetId,
  onBack,
  onContinue,
}: {
  projectId: string;
  initialDatasetId?: string;
  onBack: () => void;
  onContinue: (dataset: DatasetOption) => void;
}) => {
  const { translateText } = useI18n();
  const [datasetPopoverOpen, setDatasetPopoverOpen] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState(
    initialDatasetId ?? "",
  );

  const datasets = api.datasets.allDatasetMeta.useQuery(
    { projectId },
    {
      trpc: {
        context: {
          skipBatch: true,
        },
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    },
  );

  const selectedDataset = datasets.data?.find(
    (dataset) => dataset.id === selectedDatasetId,
  );

  return (
    <>
      <DialogHeader>
        <Button
          variant="ghost"
          onClick={onBack}
          className="inline-block self-start"
        >
          ← {translateText("Back")}
        </Button>
        <DialogTitle>{translateText("Select dataset")}</DialogTitle>
        <DialogDescription>
          {translateText(
            "Remote dataset run triggers are attached to a dataset. Choose the dataset before configuring the remote experiment.",
          )}
        </DialogDescription>
      </DialogHeader>

      <DialogBody>
        {datasets.isPending ? (
          <Skeleton className="h-24 w-full" />
        ) : datasets.data && datasets.data.length > 0 ? (
          <div className="space-y-2">
            <div className="text-sm font-medium">
              {translateText("Dataset")}
            </div>
            <Popover
              open={datasetPopoverOpen}
              onOpenChange={setDatasetPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={datasetPopoverOpen}
                  className="w-full justify-between px-2 font-normal"
                >
                  {selectedDataset?.name ?? translateText("Select a dataset")}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-(--radix-popover-trigger-width) overflow-auto p-0"
                align="start"
              >
                <InputCommand>
                  <InputCommandInput
                    placeholder={translateText("Search datasets...")}
                    className="h-9"
                    variant="bottom"
                  />
                  <InputCommandList>
                    <InputCommandEmpty>
                      {translateText("No dataset found.")}
                    </InputCommandEmpty>
                    <InputCommandGroup>
                      {datasets.data.map((dataset) => (
                        <InputCommandItem
                          key={dataset.id}
                          value={dataset.name}
                          onSelect={() => {
                            setSelectedDatasetId(dataset.id);
                            setDatasetPopoverOpen(false);
                          }}
                        >
                          {dataset.name}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              dataset.id === selectedDatasetId
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </InputCommandItem>
                      ))}
                    </InputCommandGroup>
                  </InputCommandList>
                </InputCommand>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <div className="rounded-md border p-4 text-sm">
            <div className="font-medium">
              {translateText("No datasets found")}
            </div>
            <p className="text-muted-foreground mt-1">
              {translateText(
                "Create a dataset before setting up a remote experiment trigger.",
              )}
            </p>
          </div>
        )}
      </DialogBody>

      <DialogFooter>
        <div className="flex w-full justify-end">
          <Button
            type="button"
            disabled={!selectedDataset}
            onClick={() => {
              if (selectedDataset) {
                onContinue(selectedDataset);
              }
            }}
          >
            {datasets.isFetching ? (
              <div className="mr-2">
                <Spinner size="sm" />
              </div>
            ) : null}
            {translateText("Continue")}
          </Button>
        </div>
      </DialogFooter>
    </>
  );
};
