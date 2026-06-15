import Header from "@/src/components/layouts/header";
import { useI18n } from "@/src/features/i18n/I18nProvider";
import React from "react";

export const SettingsDangerZone: React.FC<{
  items: {
    title: string;
    description: string;
    button: React.ReactNode;
  }[];
}> = ({ items }) => {
  const { translateText } = useI18n();

  return (
    <div className="space-y-3">
      <Header title={translateText("Danger Zone")} />
      <div className="rounded-lg border">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 border-b p-3 last:border-b-0"
          >
            <div>
              <h4 className="font-semibold">{translateText(item.title)}</h4>
              <p className="text-sm">{translateText(item.description)}</p>
            </div>
            {item.button}
          </div>
        ))}
      </div>
    </div>
  );
};
