"use client";

import { useCalculator } from "@/context/CalculatorContext";
import {
  accentValue,
  highlightCard,
  mutedText,
  sectionCard,
  sectionTitle,
  statCard,
  statLabel,
  statValue,
} from "@/lib/ui";

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
    <div className={sectionCard}>
      <h3 className={sectionTitle}>Subsidy calculator</h3>

      <p className="text-sm text-ink-muted">
        Cost rate: <strong>Rs. {settings.costPerKw.toLocaleString("en-IN")}/kW</strong>{" "}
        <span className="text-ink-subtle">(set in admin dashboard)</span>
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
        <div className={`${statCard} ${highlightCard}`}>
          <p className={statLabel}>Net investment</p>
          <p className={`${statValue} ${accentValue}`}>
            ₹{netInvestment.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <p className={mutedText}>
        1–{s.tier1MaxKw} kW: Rs. {s.tier1Amount.toLocaleString("en-IN")} | 2–{s.tier2MaxKw}{" "}
        kW: Rs. {s.tier2Amount.toLocaleString("en-IN")} | 3+ kW: Rs.{" "}
        {s.tier3Amount.toLocaleString("en-IN")}
      </p>
    </div>
  );
}
