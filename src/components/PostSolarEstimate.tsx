"use client";

import { computePostSolarSummary } from "@/utils/calculations";
import { useCalculator } from "@/context/CalculatorContext";
import { mutedText, sectionCard, sectionTitle, statCard, statGrid, statLabel, statValue } from "@/lib/ui";

type Props = {
  bimonthlyUnits: number;
  systemKw: number;
  panelCount: number;
};

export default function PostSolarEstimate({
  bimonthlyUnits,
  systemKw,
  panelCount,
}: Props) {
  const { panelWatts, settings } = useCalculator();
  const summary = computePostSolarSummary(bimonthlyUnits, systemKw, settings);

  return (
    <div className={sectionCard}>
      <h3 className={sectionTitle}>Post-solar estimate</h3>

      <p className={mutedText}>
        Generation uses MNRE benchmark of {settings.monthlyUnitsPerKw} units/kW/month
        (typical Tamil Nadu range 120–150). {panelCount} × {panelWatts} W panels ≈{" "}
        {Math.round(summary.generation)} units per bimonthly cycle.
      </p>

      <div className="rounded-xl bg-green-50 px-4 py-3 text-center ring-1 ring-green-200">
        <p className="text-sm text-green-800">Estimated bimonthly savings</p>
        <p className="text-2xl font-bold text-green-700 sm:text-3xl">
          ₹{Math.round(summary.bimonthlySavings).toLocaleString("en-IN")}
        </p>
        <p className="mt-1 text-xs text-green-800">
          ≈ ₹{Math.round(summary.monthlySavings).toLocaleString("en-IN")}/month average
        </p>
      </div>

      <div className={statGrid}>
        <div className={statCard}>
          <p className={statLabel}>Current bill (bimonthly)</p>
          <p className={statValue}>₹{Math.round(summary.currentBill).toLocaleString("en-IN")}</p>
        </div>
        <div className={statCard}>
          <p className={statLabel}>New bill (bimonthly)</p>
          <p className={`${statValue} text-green-700`}>
            ₹{Math.round(summary.newBill).toLocaleString("en-IN")}
          </p>
        </div>
        <div className={statCard}>
          <p className={statLabel}>Grid units after solar</p>
          <p className={statValue}>{Math.round(summary.postSolarUnits)}</p>
        </div>
      </div>
    </div>
  );
}
