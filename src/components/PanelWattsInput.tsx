"use client";

import { useEffect, useState } from "react";
import { useCalculator } from "@/context/CalculatorContext";
import {
  chipBtnClass,
  errorText,
  inputClass,
  inputErrorClass,
  labelClass,
  mutedText,
  panelBox,
} from "@/lib/ui";
import { examplePairLabel } from "@/utils/examples";
import { installerKwSteps, PANELS_PER_PAIR } from "@/utils/panels";
import { validatePanelWatts } from "@/utils/validation";

const PRESETS = [450, 540, 550, 600];

export default function PanelWattsInput() {
  const { panelWatts, setPanelWatts } = useCalculator();
  const [draft, setDraft] = useState(String(panelWatts));
  const [error, setError] = useState("");

  useEffect(() => {
    setDraft(String(panelWatts));
  }, [panelWatts]);

  function commitValue(raw: string) {
    const check = validatePanelWatts(raw);
    if (!check.ok) {
      setError(check.message);
      setPanelWatts(550);
      setDraft("550");
      return;
    }
    setError("");
    setPanelWatts(check.value!);
    setDraft(String(check.value));
  }

  const steps = installerKwSteps(panelWatts, 3);

  return (
    <div className={panelBox}>
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
        onChange={(e) => {
          setDraft(e.target.value);
          if (error) setError("");
        }}
        onBlur={() => commitValue(draft)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitValue(draft);
        }}
        className={`mt-1.5 ${error ? inputErrorClass : inputClass}`}
      />
      {error && <p className={errorText}>{error}</p>}

      <div className="mt-2 flex flex-wrap gap-2">
        {PRESETS.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => commitValue(String(w))}
            className={chipBtnClass(panelWatts === w)}
          >
            {w} W
          </button>
        ))}
      </div>

      <p className={`mt-2 ${mutedText}`}>
        Installers size in pairs ({PANELS_PER_PAIR} panels minimum). At {panelWatts} W:{" "}
        {steps.map((kw, i) => (
          <span key={kw}>
            {i > 0 ? ", " : ""}
            {(i + 1) * PANELS_PER_PAIR} panels = {kw} kW
          </span>
        ))}
        . Example 3-pair system: {examplePairLabel(panelWatts, 3)}.
      </p>
    </div>
  );
}
