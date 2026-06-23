"use client";

import { useEffect, useState } from "react";
import { calculateEmi } from "@/utils/calculations";
import { validateInterestRate, validateTenureYears } from "@/utils/validation";
import {
  errorText,
  inputClass,
  inputErrorClass,
  labelClass,
  mutedText,
  sectionCard,
  sectionTitle,
  statCard,
  statLabel,
  statValue,
} from "@/lib/ui";

type Props = {
  netInvestment: number;
  bimonthlyBill: number;
  postSolarBill: number;
  bimonthlySavings: number;
  monthlySavings: number;
  systemKw: number;
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
  postSolarBill,
  bimonthlySavings,
  monthlySavings,
  systemKw,
  interestRate,
  tenureYears,
  defaultInterestRate,
  defaultTenureYears,
  onInterestRateChange,
  onTenureYearsChange,
}: Props) {
  const [rateDraft, setRateDraft] = useState(String(interestRate));
  const [tenureDraft, setTenureDraft] = useState(String(tenureYears));
  const [rateError, setRateError] = useState("");
  const [tenureError, setTenureError] = useState("");

  useEffect(() => {
    setRateDraft(String(interestRate));
  }, [interestRate]);

  useEffect(() => {
    setTenureDraft(String(tenureYears));
  }, [tenureYears]);

  function commitRate(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) {
      setRateError("");
      setRateDraft(String(interestRate));
      return;
    }

    const next = parseFloat(trimmed);
    if (Number.isNaN(next)) {
      setRateError("Enter a valid interest rate");
      setRateDraft(String(interestRate));
      return;
    }

    const check = validateInterestRate(next);
    if (!check.ok) {
      setRateError(check.message);
      setRateDraft(String(interestRate));
      return;
    }

    setRateError("");
    onInterestRateChange(next);
    setRateDraft(String(next));
  }

  function commitTenure(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) {
      setTenureError("");
      setTenureDraft(String(tenureYears));
      return;
    }

    const next = parseFloat(trimmed);
    if (Number.isNaN(next)) {
      setTenureError("Enter a valid tenure");
      setTenureDraft(String(tenureYears));
      return;
    }

    const check = validateTenureYears(next);
    if (!check.ok) {
      setTenureError(check.message);
      setTenureDraft(String(tenureYears));
      return;
    }

    setTenureError("");
    onTenureYearsChange(Math.round(next));
    setTenureDraft(String(Math.round(next)));
  }

  const monthlyEmi = calculateEmi(netInvestment, interestRate, tenureYears);
  const bimonthlyEmi = monthlyEmi * 2;
  const monthlyBillAvg = bimonthlyBill / 2;
  const postSolarMonthly = postSolarBill / 2;
  const netMonthlyCashflow = monthlySavings - monthlyEmi;
  const netBimonthlyCashflow = bimonthlySavings - bimonthlyEmi;
  const fmt = (n: number) => Math.round(n).toLocaleString("en-IN");

  return (
    <div className={sectionCard}>
      <h3 className={sectionTitle}>EMI calculator</h3>
      <p className={mutedText}>
        Loan EMI is paid every month. TNEB bills arrive every 2 months — both views are shown for{" "}
        {systemKw} kW system on ₹{fmt(bimonthlyBill)} bimonthly energy charge.
      </p>

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
            inputMode="decimal"
            value={rateDraft}
            onChange={(e) => {
              setRateDraft(e.target.value);
              if (rateError) setRateError("");
            }}
            onBlur={() => commitRate(rateDraft)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRate(rateDraft);
            }}
            className={`mt-1.5 ${rateError ? inputErrorClass : inputClass}`}
          />
          {rateError && <p className={errorText}>{rateError}</p>}
        </div>
        <div>
          <label htmlFor="tenureYears" className={labelClass}>
            Tenure (years)
          </label>
          <input
            id="tenureYears"
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={tenureDraft}
            onChange={(e) => {
              setTenureDraft(e.target.value);
              if (tenureError) setTenureError("");
            }}
            onBlur={() => commitTenure(tenureDraft)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitTenure(tenureDraft);
            }}
            className={`mt-1.5 ${tenureError ? inputErrorClass : inputClass}`}
          />
          {tenureError && <p className={errorText}>{tenureError}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Per TNEB bill cycle (2 months)
          </p>
          <div className="mt-2 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
            <div className={statCard}>
              <p className={statLabel}>EB bill now (bimonthly)</p>
              <p className={statValue}>₹{fmt(bimonthlyBill)}</p>
            </div>
            <div className={statCard}>
              <p className={statLabel}>EB bill after solar (bimonthly)</p>
              <p className={statValue}>₹{fmt(postSolarBill)}</p>
              <p className="text-xs text-ink-muted">≈ ₹{fmt(postSolarMonthly)}/month</p>
            </div>
            <div className={statCard}>
              <p className={statLabel}>Solar savings (bimonthly)</p>
              <p className={`${statValue} text-green-700`}>₹{fmt(bimonthlySavings)}</p>
            </div>
            <div className={statCard}>
              <p className={statLabel}>Loan EMI (2 months)</p>
              <p className={statValue}>₹{fmt(bimonthlyEmi)}</p>
              <p className="text-xs text-ink-muted">₹{fmt(monthlyEmi)}/month × 2</p>
            </div>
          </div>
          <div className={`mt-3 rounded-xl border p-3 sm:p-4 ${netBimonthlyCashflow >= 0 ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
            <p className="text-sm font-semibold text-ink">
              Net per billing cycle:{" "}
              <span className={netBimonthlyCashflow >= 0 ? "text-green-700" : "text-amber-800"}>
                {netBimonthlyCashflow >= 0 ? "+" : ""}₹{fmt(netBimonthlyCashflow)}
              </span>
            </p>
            <p className="mt-1 text-xs text-ink-muted sm:text-sm">
              Solar savings − EMI for 2 months. Negative during the loan is normal — savings continue
              after the loan ends.
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Monthly averages (vs monthly EMI)
          </p>
          <div className="mt-2 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:grid-cols-4">
            <div className={statCard}>
              <p className={statLabel}>Monthly EMI</p>
              <p className={statValue}>₹{fmt(monthlyEmi)}</p>
            </div>
            <div className={statCard}>
              <p className={statLabel}>Avg monthly EB bill (before solar)</p>
              <p className={statValue}>₹{fmt(monthlyBillAvg)}</p>
              <p className="text-xs text-ink-muted">Bimonthly ÷ 2</p>
            </div>
            <div className={statCard}>
              <p className={statLabel}>Avg monthly solar savings</p>
              <p className={`${statValue} text-green-700`}>₹{fmt(monthlySavings)}</p>
            </div>
            <div className={statCard}>
              <p className={statLabel}>Net monthly cashflow</p>
              <p className={`${statValue} ${netMonthlyCashflow >= 0 ? "text-green-700" : "text-red-600"}`}>
                {netMonthlyCashflow >= 0 ? "+" : ""}₹{fmt(netMonthlyCashflow)}
              </p>
              <p className="text-xs text-ink-muted">Savings − EMI</p>
            </div>
          </div>
        </div>
      </div>

      <p className={mutedText}>
        Default loan: {defaultInterestRate}% for {defaultTenureYears} years. During loan tenure, solar
        savings may not fully cover EMI — payback improves after the loan ends.
      </p>
    </div>
  );
}
