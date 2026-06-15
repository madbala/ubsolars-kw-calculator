"use client";

import { useEffect, useState } from "react";
import { useCalculator } from "@/context/CalculatorContext";
import { inputClass, labelClass } from "@/lib/ui";
import { kwFromPanels } from "@/utils/panels";

const PRESETS = [450, 540, 550, 600];

export default function PanelWattsInput() {
  const { panelWatts, setPanelWatts } = useCalculator();
  const [draft, setDraft] = useState(String(panelWatts));

  useEffect(() => {
    setDraft(String(panelWatts));
  }, [panelWatts]);

  function commitValue(raw: string) {
    const parsed = parseFloat(raw);
    if (isNaN(parsed) || parsed < 100) {
      setPanelWatts(550);
      setDraft("550");
      return;
    }
    setPanelWatts(parsed);
    setDraft(String(parsed));
  }

  return (
    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:mb-6">
      <label htmlFor="panelWatts" className={labelClass}>
        Panel wattage (Wp per panel)
      </label>
      <input
        id="panelWatts"
        type="number"
        min="100"
        step="1"
        inputMode="numeric"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => commitValue(draft)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitValue(draft);
        }}
        className={`mt-1.5 ${inputClass}`}
      />

      <div className="mt-2 flex flex-wrap gap-2">
        {PRESETS.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => commitValue(String(w))}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium touch-manipulation ${
              panelWatts === w
                ? "bg-amber-500 text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            }`}
          >
            {w} W
          </button>
        ))}
      </div>

      <p className="mt-2 text-xs text-slate-600">
        System sizes snap to whole panels. At {panelWatts} W: 2 panels ={" "}
        {kwFromPanels(2, panelWatts)} kW, 3 panels = {kwFromPanels(3, panelWatts)} kW, 4
        panels = {kwFromPanels(4, panelWatts)} kW.
      </p>
    </div>
  );
}
