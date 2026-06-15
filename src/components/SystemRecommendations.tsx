"use client";

import type { PanelSystemOptions } from "@/utils/calculations";
import { formatSystemLabel } from "@/utils/panels";
import { useCalculator } from "@/context/CalculatorContext";
import { statCard, statLabel, statValue } from "@/lib/ui";

type Props = {
  systems: PanelSystemOptions;
  selectedKw: number;
  onSelect: (kw: number, panels: number) => void;
};

const CARDS = [
  { key: "minimum" as const, label: "Minimum", sub: "Budget — fewer panels" },
  { key: "recommended" as const, label: "Recommended", sub: "~85% bill offset" },
  { key: "maximum" as const, label: "Maximum", sub: "Full consumption offset" },
];

export default function SystemRecommendations({
  systems,
  selectedKw,
  onSelect,
}: Props) {
  const { panelWatts } = useCalculator();

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <h3 className="font-semibold text-slate-800">System size options</h3>
      <p className="text-xs text-slate-500">
        Sizes based on {panelWatts} W panels and your consumption. Tap to select.
      </p>
      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-3">
        {CARDS.map(({ key, label, sub }) => {
          const opt = systems[key];
          const active = selectedKw === opt.kw;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(opt.kw, opt.panels)}
              className={`${statCard} text-left transition touch-manipulation ${
                active ? "ring-2 ring-amber-500" : "hover:bg-slate-50"
              }`}
            >
              <p className={statLabel}>{label}</p>
              <p className={`${statValue} ${active ? "text-amber-600" : ""}`}>
                {formatSystemLabel(opt.panels, panelWatts)}
              </p>
              <p className="mt-1 text-xs text-slate-500">{sub}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
