"use client";

import { useState } from "react";
import { billToUnits, getSystemRecommendations, simulateAtKw } from "@/utils/calculations";
import { formatSystemLabel } from "@/utils/panels";
import { useCalculator } from "@/context/CalculatorContext";
import {
  actionBtns,
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
  tabBar,
  tabBtnClass,
  tableClass,
  tableWrap,
  tdClass,
  thClass,
} from "@/lib/ui";

type InputMode = "units" | "bill";

export default function KwSimulatorTab() {
  const { panelWatts, settings } = useCalculator();
  const [inputMode, setInputMode] = useState<InputMode>("units");
  const [unitsInput, setUnitsInput] = useState("");
  const [billInput, setBillInput] = useState("");
  const [kwEntries, setKwEntries] = useState<string[]>(["3", "4", "5"]);
  const [result, setResult] = useState<{
    bimonthlyUnits: number;
    inputBill?: number;
    suggestedKW: number;
    suggestedPanels: number;
    baselineBill: number;
    scenarios: ReturnType<typeof simulateAtKw>[];
  } | null>(null);

  function resolveUnits(): number | null {
    if (inputMode === "units") {
      const units = parseFloat(unitsInput);
      return units > 0 ? units : null;
    }
    const bill = parseFloat(billInput);
    if (!bill || bill <= 0) return null;
    return billToUnits(bill, settings).units;
  }

  function addKw() {
    setKwEntries((prev) => [...prev, ""]);
  }

  function removeKw(index: number) {
    if (kwEntries.length <= 1) return;
    setKwEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function handleCalculate() {
    const bimonthlyUnits = resolveUnits();
    if (!bimonthlyUnits) return;

    const kwValues = kwEntries
      .map((e) => parseFloat(e))
      .filter((v) => !isNaN(v) && v > 0);

    if (kwValues.length === 0) return;

    const scenarios = kwValues.map((kw) => simulateAtKw(bimonthlyUnits, kw, settings));
    const bill = inputMode === "bill" ? parseFloat(billInput) : undefined;
    const systems = getSystemRecommendations(bimonthlyUnits, panelWatts, settings);

    setResult({
      bimonthlyUnits,
      inputBill: bill,
      suggestedKW: systems.recommended.kw,
      suggestedPanels: systems.recommended.panels,
      baselineBill: scenarios[0].baselineBill,
      scenarios,
    });
  }

  function fillSuggested() {
    const units = resolveUnits();
    if (!units) return;
    const { recommended } = getSystemRecommendations(units, panelWatts, settings);
    setKwEntries((prev) => {
      const has = prev.some((e) => parseFloat(e) === recommended.kw);
      return has ? prev : [...prev, String(recommended.kw)];
    });
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className={`${tabBar} grid-cols-2`}>
        <button
          type="button"
          onClick={() => {
            setInputMode("units");
            setResult(null);
          }}
          className={tabBtnClass(inputMode === "units")}
        >
          By units
        </button>
        <button
          type="button"
          onClick={() => {
            setInputMode("bill");
            setResult(null);
          }}
          className={tabBtnClass(inputMode === "bill")}
        >
          By bill
        </button>
      </div>

      {inputMode === "units" ? (
        <div>
          <label htmlFor="simUnits" className={labelClass}>
            Bimonthly consumption (units)
          </label>
          <input
            id="simUnits"
            type="number"
            min="0"
            placeholder="e.g. 12000"
            value={unitsInput}
            onChange={(e) => setUnitsInput(e.target.value)}
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
      ) : (
        <div>
          <label htmlFor="simBill" className={labelClass}>
            Bimonthly bill amount (₹)
          </label>
          <input
            id="simBill"
            type="number"
            min="0"
            placeholder="e.g. 140880"
            value={billInput}
            onChange={(e) => setBillInput(e.target.value)}
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
      )}

      <div>
        <div className={actionHeader}>
          <span className={labelClass}>Solar kW to compare</span>
          <div className={actionBtns}>
            <button
              type="button"
              onClick={fillSuggested}
              className={`${linkBtn} text-slate-600 hover:text-slate-900`}
            >
              + Suggested kW
            </button>
            <button
              type="button"
              onClick={addKw}
              className={`${linkBtn} text-amber-600 hover:text-amber-700`}
            >
              + Add kW
            </button>
          </div>
        </div>
        <div className="mt-3 space-y-3">
          {kwEntries.map((entry, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="kW"
                value={entry}
                onChange={(e) =>
                  setKwEntries((prev) =>
                    prev.map((v, i) => (i === index ? e.target.value : v)),
                  )
                }
                className={inputClass}
              />
              {kwEntries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeKw(index)}
                  className={btnIcon}
                  aria-label="Remove kW"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <button type="button" onClick={handleCalculate} className={btnPrimary}>
        Compare bills
      </button>

      {result && (
        <div className={resultsBox}>
          <div className={statGrid}>
            <div className={statCard}>
              <p className={statLabel}>
                {result.inputBill != null ? "Est. consumption" : "Consumption"}
              </p>
              <p className={statValue}>{result.bimonthlyUnits} units</p>
              {result.inputBill != null && (
                <p className="mt-1 text-xs text-slate-500">
                  From bill ₹{result.inputBill.toFixed(0)}
                </p>
              )}
            </div>
            <div className={statCard}>
              <p className={statLabel}>Bill without solar</p>
              <p className={statValue}>₹{result.baselineBill.toFixed(0)}</p>
            </div>
            <div className={`${statCard} ring-2 ring-amber-400 min-[480px]:col-span-2 sm:col-span-1`}>
              <p className={statLabel}>Suggested system</p>
              <p className={`${statValue} text-amber-600`}>
                {formatSystemLabel(result.suggestedPanels, panelWatts)}
              </p>
            </div>
          </div>

          <div className={tableWrap}>
            <table className={tableClass}>
              <thead className="bg-slate-50">
                <tr>
                  <th className={thClass}>kW</th>
                  <th className={thClass}>Offset</th>
                  <th className={thClass}>Grid</th>
                  <th className={thClass}>Bill</th>
                  <th className={thClass}>Save</th>
                </tr>
              </thead>
              <tbody>
                {result.scenarios.map((row) => (
                  <tr key={row.kw} className="border-t border-slate-100">
                    <td className={`${tdClass} font-medium`}>{row.kw}</td>
                    <td className={tdClass}>{row.offset}</td>
                    <td className={tdClass}>{row.gridUnits}</td>
                    <td className={tdClass}>₹{row.bill.toFixed(0)}</td>
                    <td className={`${tdClass} text-green-700`}>
                      ₹{row.savings.toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
