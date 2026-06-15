"use client";

import { calculateEmi } from "@/utils/calculations";
import { inputClass, labelClass, statCard, statLabel, statValue } from "@/lib/ui";

type Props = {
  netInvestment: number;
  bimonthlyBill: number;
  interestRate: number;
  tenureYears: number;
  defaultInterestRate: number;
  defaultTenureYears: number;
  onInterestRateChange: (v: number) => void;
  onTenureYearsChange: (v: number) => void;
};

export default function EmiCalculator({
  netInvestment,
  bimonthlyBill,
  interestRate,
  tenureYears,
  defaultInterestRate,
  defaultTenureYears,
  onInterestRateChange,
  onTenureYearsChange,
}: Props) {
  const emi = calculateEmi(netInvestment, interestRate, tenureYears);
  const bimonthlyEmi = emi;
  const vsBill = bimonthlyBill - bimonthlyEmi;

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <h3 className="font-semibold text-slate-800">EMI calculator</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="interestRate" className={labelClass}>
            Interest rate (% p.a.)
          </label>
          <input
            id="interestRate"
            type="number"
            min="0"
            step="0.1"
            value={interestRate}
            onChange={(e) => onInterestRateChange(parseFloat(e.target.value) || 0)}
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
        <div>
          <label htmlFor="tenureYears" className={labelClass}>
            Tenure (years)
          </label>
          <input
            id="tenureYears"
            type="number"
            min="1"
            value={tenureYears}
            onChange={(e) => onTenureYearsChange(parseFloat(e.target.value) || 1)}
            className={`mt-1.5 ${inputClass}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-3">
        <div className={statCard}>
          <p className={statLabel}>Monthly EMI</p>
          <p className={statValue}>₹{Math.round(emi).toLocaleString("en-IN")}</p>
        </div>
        <div className={statCard}>
          <p className={statLabel}>Current EB bill</p>
          <p className={statValue}>₹{Math.round(bimonthlyBill).toLocaleString("en-IN")}</p>
        </div>
        <div className={statCard}>
          <p className={statLabel}>EMI vs bill</p>
          <p className={`${statValue} ${vsBill >= 0 ? "text-green-700" : "text-red-600"}`}>
            {vsBill >= 0 ? "Save " : "Extra "}₹{Math.abs(Math.round(vsBill)).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Default: {defaultInterestRate}% for {defaultTenureYears} years
      </p>
    </div>
  );
}
