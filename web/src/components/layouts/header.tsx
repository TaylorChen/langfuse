import Link from "next/link";
import DocPopup from "@/src/components/layouts/doc-popup";
import { type Status, StatusBadge } from "./status-badge";
import { cn } from "@/src/utils/tailwind";
import { useI18n } from "@/src/features/i18n/I18nProvider";

type HeaderProps = {
  title: string;
  status?: Status;
  label?: {
    text: string;
    href: string;
  };
  help?: { description: string; href?: string; className?: string };
  actionButtons?: React.ReactNode;
  className?: string;
};

export default function Header({ ...props }: HeaderProps) {
  return <BaseHeader {...props} level="h3" />;
}

export function SubHeader({ ...props }: HeaderProps) {
  return <BaseHeader {...props} level="h4" />;
}

export function SubHeaderLabel({ ...props }: HeaderProps) {
  return <BaseHeader {...props} level="h5" />;
}

function HeaderTitle({
  level,
  title,
}: {
  level: "h3" | "h4" | "h5";
  title: string;
}) {
  switch (level) {
    case "h3":
      return <h3 className="text-xl leading-7 font-bold">{title}</h3>;
    case "h4":
      return <h4 className="text-lg leading-6 font-medium">{title}</h4>;
    case "h5":
      return <h5 className="text-base leading-6 font-medium">{title}</h5>;
  }
}

function BaseHeader({ ...props }: HeaderProps & { level: "h3" | "h4" | "h5" }) {
  const { translateText } = useI18n();
  const translatedTitle = translateText(props.title);
  const translatedHelp =
    props.help && typeof props.help.description === "string"
      ? { ...props.help, description: translateText(props.help.description) }
      : props.help;

  return (
    <div className={cn(props.className, props.level === "h3" && "mb-2")}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 md:gap-5">
          <div className="flex min-w-0 flex-row items-center">
            <HeaderTitle title={translatedTitle} level={props.level} />
            {translatedHelp ? (
              <DocPopup
                description={translatedHelp.description}
                href={translatedHelp.href}
                className={translatedHelp.className}
              />
            ) : null}
          </div>
          {props.status && <StatusBadge type={props.status} />}
          {props.label && (
            <Link href={props.label.href}>
              <StatusBadge type={props.label.text} />
            </Link>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {props.actionButtons ?? null}
        </div>
      </div>
    </div>
  );
}
