"use client";

import { useCalculator } from "@/context/CalculatorContext";
import { roofMaxKw } from "@/utils/calculations";
import { sqftPerPanel } from "@/utils/panels";
import { inputClass, labelClass, statCard, statLabel, statValue } from "@/lib/ui";

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
  const maxKw = roofMaxKw(roofArea, panelWatts, settings.sqftPerKw);
  const fits = roofArea > 0 && maxKw >= suggestedKw;
  const sqftPanel = sqftPerPanel(panelWatts, settings.sqftPerKw);

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <h3 className="font-semibold text-slate-800">Roof area calculator</h3>

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
          onChange={(e) => onRoofAreaChange(parseFloat(e.target.value) || 0)}
          className={`mt-1.5 ${inputClass}`}
        />
      </div>

      {roofArea > 0 && (
        <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
          <div className={statCard}>
            <p className={statLabel}>Max possible kW</p>
            <p className={statValue}>{maxKw} kW</p>
            <p className="mt-1 text-xs text-slate-500">
              1 kW ≈ {settings.sqftPerKw} sq.ft (~{Math.round(sqftPanel)} sq.ft per{" "}
              {panelWatts} W panel)
            </p>
          </div>
          <div className={`${statCard} ${fits ? "ring-2 ring-green-400" : "ring-2 ring-amber-400"}`}>
            <p className={statLabel}>Suggested vs roof</p>
            <p className={`${statValue} ${fits ? "text-green-700" : "text-amber-600"}`}>
              {fits ? "Fits" : "May need more area"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Need {suggestedKw} kW (~{Math.ceil((suggestedKw * 1000) / panelWatts)} panels)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
