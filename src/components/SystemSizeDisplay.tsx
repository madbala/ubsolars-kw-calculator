"use client";

import { kwFromPanels } from "@/utils/panels";
import { accentValue } from "@/lib/ui";

type Props = {
  panels: number;
  panelWatts: number;
  highlight?: boolean;
};

export default function SystemSizeDisplay({ panels, panelWatts, highlight = false }: Props) {
  const kw = kwFromPanels(panels, panelWatts);

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span
        className={`text-2xl font-bold tracking-tight sm:text-[1.65rem] ${
          highlight ? accentValue : "text-ink"
        }`}
      >
        {kw} kW
      </span>
      <span className="text-sm font-medium text-ink-muted">{panels} panels</span>
    </div>
  );
}
