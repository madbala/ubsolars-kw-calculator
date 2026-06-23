"use client";

import { useState } from "react";
import {
  calculateEnergyCharge,
  getSystemRecommendations,
  unitStats,
} from "@/utils/calculations";
import { useCalculator } from "@/context/CalculatorContext";
import { exampleUnitsPlaceholder } from "@/utils/examples";
import { validateUnits } from "@/utils/validation";
import ResultEnhancements from "./ResultEnhancements";
import SystemSizeDisplay from "./SystemSizeDisplay";
import {
  actionHeader,
  btnIcon,
  btnPrimary,
  errorText,
  inputClass,
  inputErrorClass,
  labelClass,
  linkBtnAccent,
  mutedText,
  resultsBox,
  statCard,
  statGrid,
  statLabel,
  statValue,
} from "@/lib/ui";

export default function UnitsCalculatorTab() {
  const { panelWatts, settings } = useCalculator();
  const [entries, setEntries] = useState<string[]>(["", ""]);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<number, string>>({});
  const [results, setResults] = useState<{
    min: number;
    max: number;
    average: number;
    suggestions: { label: string; units: number; kw: number; panels: number }[];
  } | null>(null);

  const unitsPlaceholder = exampleUnitsPlaceholder(settings);

  function addEntry() {
    setEntries((prev) => [...prev, ""]);
  }

  function removeEntry(index: number) {
    if (entries.length <= 1) return;
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function handleCalculate() {
    setError("");
    setFieldErrors({});

    const values: number[] = [];
    const nextFieldErrors: Record<number, string> = {};

    entries.forEach((entry, index) => {
      if (!entry.trim()) return;
      const check = validateUnits(entry);
      if (!check.ok) {
        nextFieldErrors[index] = check.message;
        return;
      }
      values.push(check.value!);
    });

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setResults(null);
      return;
    }

    if (values.length === 0) {
      setError("Enter at least one valid bimonthly reading");
      setResults(null);
      return;
    }

    const stats = unitStats(values);
    const toSuggestion = (label: string, units: number) => {
      const { recommended } = getSystemRecommendations(units, panelWatts, settings);
      return { label, units, kw: recommended.kw, panels: recommended.panels };
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
          <button type="button" onClick={addEntry} className={linkBtnAccent}>
            + Add reading
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {entries.map((entry, index) => (
            <div key={index}>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder={
                    index === 0 ? unitsPlaceholder : `Reading ${index + 1} (units)`
                  }
                  value={entry}
                  onChange={(e) => {
                    setEntries((prev) =>
                      prev.map((v, i) => (i === index ? e.target.value : v)),
                    );
                    if (fieldErrors[index]) {
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next[index];
                        return next;
                      });
                    }
                  }}
                  className={fieldErrors[index] ? inputErrorClass : inputClass}
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
              {fieldErrors[index] && (
                <p className={errorText}>{fieldErrors[index]}</p>
              )}
            </div>
          ))}
        </div>
        {error && <p className={errorText}>{error}</p>}
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
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-surface px-3 py-3 shadow-sm sm:px-4"
              >
                <span className="min-w-0 text-sm font-medium sm:text-base">
                  {s.label}
                  <span className="text-ink-muted"> ({s.units} units)</span>
                </span>
                <SystemSizeDisplay panels={s.panels} panelWatts={panelWatts} highlight />
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
