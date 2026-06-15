"use client";

import { useCalculator } from "@/context/CalculatorContext";
import { statCard, statLabel, statValue } from "@/lib/ui";

type Props = {
  totalCost: number;
  subsidy: number;
  netInvestment: number;
  systemKw: number;
};

export default function SubsidyCard({
  totalCost,
  subsidy,
  netInvestment,
  systemKw,
}: Props) {
  const { settings } = useCalculator();
  const s = settings.subsidy;

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <h3 className="font-semibold text-slate-800">Subsidy calculator</h3>

      <p className="text-sm text-slate-600">
        Cost rate: <strong>Rs. {settings.costPerKw.toLocaleString("en-IN")}/kW</strong>{" "}
        <span className="text-xs text-slate-400">(set in admin dashboard)</span>
      </p>

      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-3">
        <div className={statCard}>
          <p className={statLabel}>Total cost ({systemKw} kW)</p>
          <p className={statValue}>₹{totalCost.toLocaleString("en-IN")}</p>
        </div>
        <div className={statCard}>
          <p className={statLabel}>Subsidy</p>
          <p className={`${statValue} text-green-700`}>
            ₹{subsidy.toLocaleString("en-IN")}
          </p>
        </div>
        <div className={`${statCard} ring-2 ring-amber-400`}>
          <p className={statLabel}>Net investment</p>
          <p className={`${statValue} text-amber-600`}>
            ₹{netInvestment.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        1–{s.tier1MaxKw} kW: Rs. {s.tier1Amount.toLocaleString("en-IN")} | 2–{s.tier2MaxKw}{" "}
        kW: Rs. {s.tier2Amount.toLocaleString("en-IN")} | 3+ kW: Rs.{" "}
        {s.tier3Amount.toLocaleString("en-IN")}
      </p>
    </div>
  );
}
