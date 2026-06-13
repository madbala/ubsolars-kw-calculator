"use client";

import { useState } from "react";
import {
  calculateEnergyCharge,
  estimateUnitsFromBill,
  getSlabBreakdown,
  suggestKW,
} from "@/lib/tneb";
import {
  btnPrimary,
  inputClass,
  labelClass,
  resultsBox,
  statCard,
  statGrid,
  statLabel,
  statValue,
  tableClass,
  tableWrap,
  tdClass,
  thClass,
} from "@/lib/ui";

export default function BillCalculatorTab() {
  const [billAmount, setBillAmount] = useState("");
  const [result, setResult] = useState<{
    units: number;
    estimatedCharge: number;
    suggestedKW: number;
    breakdown: ReturnType<typeof getSlabBreakdown>;
  } | null>(null);

  function handleCalculate() {
    const amount = parseFloat(billAmount);
    if (!amount || amount <= 0) return;
    const { units, estimatedCharge } = estimateUnitsFromBill(amount);
    setResult({
      units,
      estimatedCharge,
      suggestedKW: suggestKW(units),
      breakdown: getSlabBreakdown(units),
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
              <p className={statLabel}>Suggested kW</p>
              <p className={`${statValue} text-amber-600`}>{result.suggestedKW} kW</p>
            </div>
          </div>

          {result.breakdown.length > 0 && (
            <div className={tableWrap}>
              <table className={tableClass}>
                <thead className="bg-slate-50">
                  <tr>
                    <th className={thClass}>Slab</th>
                    <th className={thClass}>Units</th>
                    <th className={thClass}>Rate</th>
                    <th className={thClass}>Charge</th>
                  </tr>
                </thead>
                <tbody>
                  {result.breakdown.map((row) => (
                    <tr key={row.range} className="border-t border-slate-100">
                      <td className={tdClass}>{row.range}</td>
                      <td className={tdClass}>{row.unitsInSlab}</td>
                      <td className={tdClass}>₹{row.rate}</td>
                      <td className={tdClass}>₹{row.charge.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-slate-200 font-semibold">
                    <td className={tdClass} colSpan={3}>Total</td>
                    <td className={tdClass}>
                      ₹{calculateEnergyCharge(result.units).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
