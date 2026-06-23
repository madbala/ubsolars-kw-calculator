"use client";

import type { PanelSystemOptions } from "@/utils/calculations";
import { useCalculator } from "@/context/CalculatorContext";
import {
  highlightCard,
  mutedText,
  sectionCardCompact,
  sectionTitle,
  statCard,
  statLabel,
} from "@/lib/ui";
import SystemSizeDisplay from "./SystemSizeDisplay";

type Props = {
  systems: PanelSystemOptions;
  selectedKw: number;
  onSelect: (kw: number, panels: number) => void;
};

const CARDS = [
  { key: "minimum" as const, label: "Minimum", sub: "Budget — fewer panels" },
  { key: "maximum" as const, label: "Maximum", sub: "Full consumption offset" },
  { key: "recommended" as const, label: "Recommended", sub: "~85% bill offset" },
];

export default function SystemRecommendations({
  systems,
  selectedKw,
  onSelect,
}: Props) {
  const { panelWatts } = useCalculator();

  return (
    <div className={sectionCardCompact}>
      <h3 className={sectionTitle}>System size options</h3>
      <p className={mutedText}>
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
                active ? highlightCard : "hover:bg-surface-muted"
              }`}
            >
              <p className={statLabel}>{label}</p>
              <SystemSizeDisplay
                panels={opt.panels}
                panelWatts={panelWatts}
                highlight={active}
              />
              <p className={`mt-1 ${mutedText}`}>{sub}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
