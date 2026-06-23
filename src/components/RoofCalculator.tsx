"use client";

import { useState } from "react";
import { useCalculator } from "@/context/CalculatorContext";
import { roofMaxKw } from "@/utils/calculations";
import { panelsForTargetKw, sqftPerPanel } from "@/utils/panels";
import { validateRoofArea } from "@/utils/validation";
import {
  accentValue,
  errorText,
  highlightCard,
  inputClass,
  inputErrorClass,
  labelClass,
  mutedText,
  sectionCard,
  sectionTitle,
  statCard,
  statLabel,
  statValue,
} from "@/lib/ui";

type Props = {
  suggestedKw: number;
  roofArea: number;
  onRoofAreaChange: (area: number) => void;
};

export default function RoofCalculator({
  suggestedKw,
  roofArea,
  onRoofAreaChange,
}: Props) {
  const { panelWatts, settings } = useCalculator();
  const [roofError, setRoofError] = useState("");
  const maxKw = roofMaxKw(roofArea, panelWatts, settings.sqftPerKw);
  const fits = roofArea > 0 && maxKw >= suggestedKw;
  const sqftPanel = sqftPerPanel(panelWatts, settings.sqftPerKw);
  const neededPanels = panelsForTargetKw(suggestedKw, panelWatts);

  function handleRoofChange(raw: string) {
    if (!raw.trim()) {
      setRoofError("");
      onRoofAreaChange(0);
      return;
    }
    const check = validateRoofArea(raw);
    if (!check.ok) {
      setRoofError(check.message);
      return;
    }
    setRoofError("");
    onRoofAreaChange(check.value!);
  }

  return (
    <div className={sectionCard}>
      <h3 className={sectionTitle}>Roof area calculator</h3>

      <div>
        <label htmlFor="roofArea" className={labelClass}>
          Available roof area (sq.ft)
        </label>
        <input
          id="roofArea"
          type="number"
          min="0"
          placeholder="e.g. 400"
          value={roofArea || ""}
          onChange={(e) => handleRoofChange(e.target.value)}
          className={`mt-1.5 ${roofError ? inputErrorClass : inputClass}`}
        />
        {roofError && <p className={errorText}>{roofError}</p>}
      </div>

      {roofArea > 0 && (
        <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
          <div className={statCard}>
            <p className={statLabel}>Max possible kW</p>
            <p className={statValue}>{maxKw} kW</p>
            <p className={`mt-1 ${mutedText}`}>
              1 kW ≈ {settings.sqftPerKw} sq.ft (~{Math.round(sqftPanel)} sq.ft per{" "}
              {panelWatts} W panel)
            </p>
          </div>
          <div
            className={`${statCard} ${fits ? "ring-2 ring-green-400" : highlightCard}`}
          >
            <p className={statLabel}>Suggested vs roof</p>
            <p className={`${statValue} ${fits ? "text-green-700" : accentValue}`}>
              {fits ? "Fits" : "May need more area"}
            </p>
            <p className={`mt-1 ${mutedText}`}>
              Need {suggestedKw} kW ({neededPanels} panels in pairs)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
