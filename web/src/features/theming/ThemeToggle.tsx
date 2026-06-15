import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/src/utils/tailwind";
import { usePostHogClientCapture } from "@/src/features/posthog-analytics/usePostHogClientCapture";
import { useI18n } from "@/src/features/i18n/I18nProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const capture = usePostHogClientCapture();
  const { translateText } = useI18n();
  return (
    <div className="flex items-center space-x-1">
      <span className="mr-2">{translateText("Theme")}</span>
      <div title={translateText("Light mode")}>
        <Sun
          className={cn(
            theme === "light" ? "text-primary-accent" : "",
            "text:primary hover:bg-input hover:text-primary-accent h-[1.6rem] w-[1.6rem] rounded-sm p-1",
          )}
          onClick={(e) => {
            e.preventDefault();
            setTheme("light");
            capture("user_settings:theme_changed", {
              theme: "light",
            });
          }}
        />
      </div>
      <div title={translateText("Dark mode")}>
        <Moon
          className={cn(
            theme === "dark" ? "text-primary-accent" : "",
            "hover:bg-input hover:text-primary-accent h-[1.6rem] w-[1.6rem] rounded-sm p-1",
          )}
          onClick={(e) => {
            e.preventDefault();
            setTheme("dark");
            capture("user_settings:theme_changed", {
              theme: "dark",
            });
          }}
        />
      </div>
      <div title={translateText("System mode")}>
        <Monitor
          className={cn(
            theme === "system" ? "text-primary-accent" : "",
            "hover:bg-input hover:text-primary-accent h-[1.6rem] w-[1.6rem] rounded-sm p-1",
          )}
          onClick={(e) => {
            e.preventDefault();
            setTheme("system");
            capture("user_settings:theme_changed", {
              theme: "system",
            });
          }}
        />
      </div>
    </div>
  );
}
