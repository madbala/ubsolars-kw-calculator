"use client";

import { useState } from "react";
import {
  calculateEnergyCharge,
  solarSizing,
  unitStats,
} from "@/utils/calculations";
import { formatSystemLabel } from "@/utils/panels";
import { useCalculator } from "@/context/CalculatorContext";
import ResultEnhancements from "./ResultEnhancements";
import {
  actionHeader,
  btnIcon,
  btnPrimary,
  inputClass,
  labelClass,
  linkBtn,
  resultsBox,
  statCard,
  statGrid,
  statLabel,
  statValue,
} from "@/lib/ui";

export default function UnitsCalculatorTab() {
  const { panelWatts, settings } = useCalculator();
  const [entries, setEntries] = useState<string[]>(["", ""]);
  const [results, setResults] = useState<{
    min: number;
    max: number;
    average: number;
    suggestions: { label: string; units: number; kw: number; panels: number }[];
  } | null>(null);

  function addEntry() {
    setEntries((prev) => [...prev, ""]);
  }

  function removeEntry(index: number) {
    if (entries.length <= 1) return;
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function handleCalculate() {
    const values = entries
      .map((e) => parseFloat(e))
      .filter((v) => !isNaN(v) && v > 0);
    if (values.length === 0) return;

    const stats = unitStats(values);
    const toSuggestion = (label: string, units: number) => {
      const kw = solarSizing(units, panelWatts, settings);
      const panels = Math.ceil((kw * 1000) / panelWatts);
      return { label, units, kw, panels };
    };

    setResults({
      min: stats.min,
      max: stats.max,
      average: stats.average,
      suggestions: [
        toSuggestion("Minimum", stats.min),
        toSuggestion("Average", stats.average),
        toSuggestion("Maximum", stats.max),
      ],
    });
  }

  const primary = results
    ? results.suggestions.find((s) => s.label === "Average") ?? results.suggestions[0]
    : null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <div className={actionHeader}>
          <span className={labelClass}>Bimonthly readings</span>
          <button
            type="button"
            onClick={addEntry}
            className={`${linkBtn} text-amber-600 hover:text-amber-700`}
          >
            + Add reading
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {entries.map((entry, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="number"
                min="0"
                placeholder={`Reading ${index + 1} (units)`}
                value={entry}
                onChange={(e) =>
                  setEntries((prev) =>
                    prev.map((v, i) => (i === index ? e.target.value : v)),
                  )
                }
                className={inputClass}
              />
              {entries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEntry(index)}
                  className={btnIcon}
                  aria-label="Remove reading"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <button type="button" onClick={handleCalculate} className={btnPrimary}>
        Calculate
      </button>

      {results && primary && (
        <div className={resultsBox}>
          <div className={statGrid}>
            <div className={statCard}>
              <p className={statLabel}>Min</p>
              <p className={statValue}>{results.min}</p>
            </div>
            <div className={statCard}>
              <p className={statLabel}>Avg</p>
              <p className={statValue}>{results.average}</p>
            </div>
            <div className={statCard}>
              <p className={statLabel}>Max</p>
              <p className={statValue}>{results.max}</p>
            </div>
          </div>
          <div className="space-y-2">
            {results.suggestions.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-3 shadow-sm sm:px-4"
              >
                <span className="min-w-0 text-sm font-medium sm:text-base">
                  {s.label}
                  <span className="text-slate-500"> ({s.units} units)</span>
                </span>
                <span className="shrink-0 text-lg font-bold text-amber-600 sm:text-xl">
                  {formatSystemLabel(s.panels, panelWatts)}
                </span>
              </div>
            ))}
          </div>

          <ResultEnhancements
            bimonthlyUnits={primary.units}
            suggestedKW={primary.kw}
            energyCharge={calculateEnergyCharge(primary.units, settings)}
          />
        </div>
      )}
    </div>
  );
}
