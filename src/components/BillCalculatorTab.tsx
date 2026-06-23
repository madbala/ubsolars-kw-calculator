"use client";

import { useState } from "react";
import { billToUnits, getSystemRecommendations } from "@/utils/calculations";
import { useCalculator } from "@/context/CalculatorContext";
import { exampleBillPlaceholder } from "@/utils/examples";
import { validateBillAmount } from "@/utils/validation";
import ResultEnhancements from "./ResultEnhancements";
import SystemSizeDisplay from "./SystemSizeDisplay";
import {
  btnPrimary,
  errorText,
  highlightCard,
  inputClass,
  inputErrorClass,
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
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    units: number;
    estimatedCharge: number;
    suggestedKW: number;
    panels: number;
  } | null>(null);

  function handleCalculate() {
    setError("");
    const check = validateBillAmount(billAmount);
    if (!check.ok) {
      setError(check.message);
      setResult(null);
      return;
    }

    const amount = check.value!;
    const { units, estimatedCharge } = billToUnits(amount, settings);
    const { recommended } = getSystemRecommendations(units, panelWatts, settings);

    if (units <= 0) {
      setError("Could not estimate units from this bill amount");
      setResult(null);
      return;
    }

    setResult({
      units,
      estimatedCharge,
      suggestedKW: recommended.kw,
      panels: recommended.panels,
    });
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
          inputMode="numeric"
          placeholder={exampleBillPlaceholder(settings)}
          value={billAmount}
          onChange={(e) => {
            setBillAmount(e.target.value);
            if (error) setError("");
          }}
          className={`mt-1.5 ${error ? inputErrorClass : inputClass}`}
        />
        {error && <p className={errorText}>{error}</p>}
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
            <div className={`${statCard} ${highlightCard} min-[480px]:col-span-2 sm:col-span-1`}>
              <p className={statLabel}>Suggested system</p>
              <SystemSizeDisplay
                panels={result.panels}
                panelWatts={panelWatts}
                highlight
              />
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
