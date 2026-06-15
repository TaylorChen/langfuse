import React from "react";
import { CommandItem } from "cmdk";
import { useI18n } from "@/src/features/i18n/I18nProvider";

type TagItemCreateProps = {
  inputValue: string;
  options: string[];
  onSelect: () => void;
};

const TagItemCreate = ({
  inputValue,
  options,
  onSelect,
}: TagItemCreateProps) => {
  const { translateText } = useI18n();
  const hasNoOption = !options
    .map((value) => value.toLowerCase())
    .includes(inputValue.toLowerCase());

  const render = inputValue !== "" && hasNoOption;

  if (!render) return null;

  return (
    <CommandItem
      key={inputValue}
      value={inputValue.trim()}
      className="text-muted-foreground hover:bg-secondary/80 flex min-h-8 cursor-pointer items-center rounded-sm px-3 py-1 text-sm"
      onSelect={onSelect}
    >
      {translateText("Create new tag: {tag}", {
        tag: `"${inputValue.trim()}"`,
      })}
    </CommandItem>
  );
};

export default TagItemCreate;
