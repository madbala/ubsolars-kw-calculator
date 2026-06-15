"use client";

import { useState } from "react";
import { billToUnits, solarSizing } from "@/utils/calculations";
import { formatSystemLabel } from "@/utils/panels";
import { useCalculator } from "@/context/CalculatorContext";
import ResultEnhancements from "./ResultEnhancements";
import {
  btnPrimary,
  inputClass,
  labelClass,
  resultsBox,
  statCard,
  statGrid,
  statLabel,
  statValue,
} from "@/lib/ui";

export default function BillCalculatorTab() {
  const { panelWatts, settings } = useCalculator();
  const [billAmount, setBillAmount] = useState("");
  const [result, setResult] = useState<{
    units: number;
    estimatedCharge: number;
    suggestedKW: number;
    panels: number;
  } | null>(null);

  function handleCalculate() {
    const amount = parseFloat(billAmount);
    if (!amount || amount <= 0) return;
    const { units, estimatedCharge } = billToUnits(amount, settings);
    const suggestedKW = solarSizing(units, panelWatts, settings);
    const panels = Math.ceil((suggestedKW * 1000) / panelWatts);
    setResult({ units, estimatedCharge, suggestedKW, panels });
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <label htmlFor="billAmount" className={labelClass}>
          Bimonthly bill amount (₹)
        </label>
        <input
          id="billAmount"
          type="number"
          min="0"
          step="1"
          placeholder="e.g. 2500"
          value={billAmount}
          onChange={(e) => setBillAmount(e.target.value)}
          className={`mt-1.5 ${inputClass}`}
        />
      </div>

      <button type="button" onClick={handleCalculate} className={btnPrimary}>
        Calculate
      </button>

      {result && (
        <div className={resultsBox}>
          <div className={statGrid}>
            <div className={statCard}>
              <p className={statLabel}>Estimated units</p>
              <p className={statValue}>{result.units}</p>
            </div>
            <div className={statCard}>
              <p className={statLabel}>Energy charge</p>
              <p className={statValue}>₹{result.estimatedCharge.toFixed(0)}</p>
            </div>
            <div className={`${statCard} ring-2 ring-amber-400 min-[480px]:col-span-2 sm:col-span-1`}>
              <p className={statLabel}>Suggested system</p>
              <p className={`${statValue} text-amber-600`}>
                {formatSystemLabel(result.panels, panelWatts)}
              </p>
            </div>
          </div>

          <ResultEnhancements
            bimonthlyUnits={result.units}
            suggestedKW={result.suggestedKW}
            energyCharge={result.estimatedCharge}
          />
        </div>
      )}
    </div>
  );
}
