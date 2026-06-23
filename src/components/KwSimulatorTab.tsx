"use client";

import { useEffect, useMemo, useState } from "react";
import { billToUnits, getSystemRecommendations, simulateAtKw } from "@/utils/calculations";
import { useCalculator } from "@/context/CalculatorContext";
import {
  exampleBillPlaceholder,
  exampleInstallerKwSteps,
  exampleUnitsPlaceholder,
} from "@/utils/examples";
import { validateBillAmount, validateKw, validateUnits } from "@/utils/validation";
import SystemSizeDisplay from "./SystemSizeDisplay";
import {
  actionBtns,
  actionHeader,
  btnIcon,
  btnPrimary,
  errorText,
  highlightCard,
  inputClass,
  inputErrorClass,
  labelClass,
  linkBtnAccent,
  linkBtnMuted,
  mutedText,
  resultsBox,
  rowDivider,
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
  theadClass,
} from "@/lib/ui";

type InputMode = "units" | "bill";

export default function KwSimulatorTab() {
  const { panelWatts, settings } = useCalculator();
  const defaultKwSteps = useMemo(
    () => exampleInstallerKwSteps(panelWatts, 3).map(String),
    [panelWatts],
  );

  useEffect(() => {
    setKwEntries(exampleInstallerKwSteps(panelWatts, 3).map(String));
  }, [panelWatts]);

  const [inputMode, setInputMode] = useState<InputMode>("units");
  const [unitsInput, setUnitsInput] = useState("");
  const [billInput, setBillInput] = useState("");
  const [kwEntries, setKwEntries] = useState<string[]>(defaultKwSteps);
  const [error, setError] = useState("");
  const [kwErrors, setKwErrors] = useState<Record<number, string>>({});
  const [result, setResult] = useState<{
    bimonthlyUnits: number;
    inputBill?: number;
    suggestedKW: number;
    suggestedPanels: number;
    baselineBill: number;
    scenarios: ReturnType<typeof simulateAtKw>[];
  } | null>(null);

  function resolveUnits(): { ok: true; units: number } | { ok: false; message: string } {
    if (inputMode === "units") {
      const check = validateUnits(unitsInput);
      if (!check.ok) return { ok: false, message: check.message };
      return { ok: true, units: check.value! };
    }
    const check = validateBillAmount(billInput);
    if (!check.ok) return { ok: false, message: check.message };
    const units = billToUnits(check.value!, settings).units;
    if (units <= 0) {
      return { ok: false, message: "Could not estimate units from this bill amount" };
    }
    return { ok: true, units };
  }

  function addKw() {
    setKwEntries((prev) => [...prev, ""]);
  }

  function removeKw(index: number) {
    if (kwEntries.length <= 1) return;
    setKwEntries((prev) => prev.filter((_, i) => i !== index));
  }

  function handleCalculate() {
    setError("");
    setKwErrors({});

    const unitsResult = resolveUnits();
    if (!unitsResult.ok) {
      setError(unitsResult.message);
      setResult(null);
      return;
    }

    const bimonthlyUnits = unitsResult.units;
    const kwValues: number[] = [];
    const nextKwErrors: Record<number, string> = {};

    kwEntries.forEach((entry, index) => {
      if (!entry.trim()) return;
      const check = validateKw(entry);
      if (!check.ok) {
        nextKwErrors[index] = check.message;
        return;
      }
      kwValues.push(check.value!);
    });

    if (Object.keys(nextKwErrors).length > 0) {
      setKwErrors(nextKwErrors);
      setResult(null);
      return;
    }

    if (kwValues.length === 0) {
      setError("Enter at least one kW size to compare");
      setResult(null);
      return;
    }

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
    const unitsResult = resolveUnits();
    if (!unitsResult.ok) {
      setError(unitsResult.message);
      return;
    }
    const { recommended } = getSystemRecommendations(
      unitsResult.units,
      panelWatts,
      settings,
    );
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
            setError("");
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
            setError("");
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
            inputMode="numeric"
            placeholder={exampleUnitsPlaceholder(settings)}
            value={unitsInput}
            onChange={(e) => {
              setUnitsInput(e.target.value);
              if (error) setError("");
            }}
            className={`mt-1.5 ${error && inputMode === "units" ? inputErrorClass : inputClass}`}
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
            inputMode="numeric"
            placeholder={exampleBillPlaceholder(settings)}
            value={billInput}
            onChange={(e) => {
              setBillInput(e.target.value);
              if (error) setError("");
            }}
            className={`mt-1.5 ${error && inputMode === "bill" ? inputErrorClass : inputClass}`}
          />
        </div>
      )}

      <div>
        <div className={actionHeader}>
          <span className={labelClass}>Solar kW to compare</span>
          <div className={actionBtns}>
            <button type="button" onClick={fillSuggested} className={linkBtnMuted}>
              + Suggested kW
            </button>
            <button type="button" onClick={addKw} className={linkBtnAccent}>
              + Add kW
            </button>
          </div>
        </div>
        <p className={`mt-1 ${mutedText}`}>
          Defaults use installer pairs (2, 4, 6 panels) for {panelWatts} W modules
        </p>
        <div className="mt-3 space-y-3">
          {kwEntries.map((entry, index) => (
            <div key={index}>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  inputMode="decimal"
                  placeholder="kW"
                  value={entry}
                  onChange={(e) => {
                    setKwEntries((prev) =>
                      prev.map((v, i) => (i === index ? e.target.value : v)),
                    );
                    if (kwErrors[index]) {
                      setKwErrors((prev) => {
                        const next = { ...prev };
                        delete next[index];
                        return next;
                      });
                    }
                  }}
                  className={kwErrors[index] ? inputErrorClass : inputClass}
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
              {kwErrors[index] && <p className={errorText}>{kwErrors[index]}</p>}
            </div>
          ))}
        </div>
      </div>

      {error && <p className={errorText}>{error}</p>}

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
                <p className={`mt-1 ${mutedText}`}>
                  From bill ₹{result.inputBill.toFixed(0)}
                </p>
              )}
            </div>
            <div className={statCard}>
              <p className={statLabel}>Bill without solar</p>
              <p className={statValue}>₹{result.baselineBill.toFixed(0)}</p>
            </div>
            <div className={`${statCard} ${highlightCard} min-[480px]:col-span-2 sm:col-span-1`}>
              <p className={statLabel}>Suggested system</p>
              <SystemSizeDisplay
                panels={result.suggestedPanels}
                panelWatts={panelWatts}
                highlight
              />
            </div>
          </div>

          <div className={tableWrap}>
            <table className={tableClass}>
              <thead className={theadClass}>
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
                  <tr key={row.kw} className={rowDivider}>
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
