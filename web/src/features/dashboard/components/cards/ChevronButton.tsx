import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export const ExpandListButton = ({
  isExpanded,
  setExpanded,
  totalLength,
  maxLength,
  expandText = "See more",
}: {
  isExpanded: boolean;
  setExpanded: (isExpanded: boolean) => void;
  totalLength: number;
  maxLength: number;
  expandText?: string;
}) => {
  const { translateText } = useI18n();

  if (totalLength <= maxLength) {
    return null;
  }

  return (
    <Button
      className="mt-2"
      variant="ghost"
      onClick={() => setExpanded(!isExpanded)}
    >
      {isExpanded ? (
        <>
          <ChevronUp className="mr-2 h-4 w-4" /> {translateText("See less")}
        </>
      ) : (
        <>
          <ChevronDown className="mr-2 h-4 w-4" /> {translateText(expandText)}
        </>
      )}
    </Button>
  );
};
