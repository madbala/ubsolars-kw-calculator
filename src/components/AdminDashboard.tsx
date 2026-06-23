"use client";

import { useEffect, useState } from "react";
import { useCalculator } from "@/context/CalculatorContext";
import { btnPrimary, inputClass, labelClass } from "@/lib/ui";
import { isAdminUnlocked, setAdminUnlocked } from "@/utils/adminSession";
import { closeAdminSession, openAdminSession } from "@/utils/settingsClient";
import type { AppSettings, CompanyInfo } from "@/utils/settings";

function randomSixDigit(): number {
  return Math.floor(100_000 + Math.random() * 900_000);
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={`mt-1 ${inputClass}`}
      />
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 ${inputClass}`}
      />
    </div>
  );
}

function CompanyFields({
  company,
  onChange,
}: {
  company: CompanyInfo;
  onChange: (company: CompanyInfo) => void;
}) {
  const fields: { key: keyof CompanyInfo; label: string }[] = [
    { key: "name", label: "Company name" },
    { key: "addressLine1", label: "Address line 1" },
    { key: "addressLine2", label: "Address line 2" },
    { key: "pincode", label: "Pincode" },
    { key: "phone1", label: "Phone 1" },
    { key: "phone2", label: "Phone 2" },
  ];

  return (
    <>
      {fields.map(({ key, label }) => (
        <TextField
          key={key}
          label={label}
          value={company[key]}
          onChange={(v) => onChange({ ...company, [key]: v })}
        />
      ))}
    </>
  );
}

function AdminSettingsForm() {
  const { settings, updateSettings } = useCalculator();
  const [draft, setDraft] = useState<AppSettings>(settings);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => setDraft(settings), [settings]);

  async function save() {
    setSaveError("");
    try {
      await updateSettings(draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save settings");
    }
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-xl border border-border p-4">
        <h3 className="font-semibold text-ink">Company (PDF proposal)</h3>
        <CompanyFields
          company={draft.company}
          onChange={(company) => setDraft({ ...draft, company })}
        />
        <NumberField
          label="Proposal validity (days)"
          value={draft.proposalValidDays}
          onChange={(v) => setDraft({ ...draft, proposalValidDays: v })}
        />
      </section>

      <section className="space-y-3 rounded-xl border border-border p-4">
        <h3 className="font-semibold text-ink">Pricing &amp; generation</h3>
        <NumberField
          label="Cost per kW (Rs.)"
          value={draft.costPerKw}
          onChange={(v) => setDraft({ ...draft, costPerKw: v })}
        />
        <NumberField
          label="Generation benchmark (units/kW/month)"
          value={draft.monthlyUnitsPerKw}
          onChange={(v) => setDraft({ ...draft, monthlyUnitsPerKw: v })}
        />
        <NumberField
          label="Roof area per kW (sq.ft)"
          value={draft.sqftPerKw}
          onChange={(v) => setDraft({ ...draft, sqftPerKw: v })}
        />
        <p className="text-xs text-ink-muted">
          MNRE typical range 120–150 units/kW/month for Tamil Nadu.
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-border p-4">
        <h3 className="font-semibold text-ink">Loan defaults</h3>
        <NumberField
          label="Default interest rate (% p.a.)"
          value={draft.defaultInterestRate}
          step={0.1}
          onChange={(v) => setDraft({ ...draft, defaultInterestRate: v })}
        />
        <NumberField
          label="Default tenure (years)"
          value={draft.defaultTenureYears}
          onChange={(v) => setDraft({ ...draft, defaultTenureYears: v })}
        />
      </section>

      <section className="space-y-3 rounded-xl border border-border p-4">
        <h3 className="font-semibold text-ink">ROI assumptions</h3>
        <NumberField
          label="ROI projection years"
          value={draft.roiYears}
          onChange={(v) => setDraft({ ...draft, roiYears: v })}
        />
        <NumberField
          label="Annual savings growth (%)"
          value={draft.annualSavingsGrowthPercent}
          step={0.1}
          onChange={(v) => setDraft({ ...draft, annualSavingsGrowthPercent: v })}
        />
        <NumberField
          label="Units per kW per year"
          value={draft.unitsPerKwYear}
          onChange={(v) => setDraft({ ...draft, unitsPerKwYear: v })}
        />
      </section>

      <section className="space-y-3 rounded-xl border border-border p-4">
        <h3 className="font-semibold text-ink">TNEB — consumption up to 500 units</h3>
        <NumberField
          label="Free units up to"
          value={draft.tnebUnder500.freeUpTo}
          onChange={(v) =>
            setDraft({ ...draft, tnebUnder500: { ...draft.tnebUnder500, freeUpTo: v } })
          }
        />
        <NumberField
          label="Rate 201–400 (Rs./unit)"
          value={draft.tnebUnder500.rate201to400}
          step={0.01}
          onChange={(v) =>
            setDraft({ ...draft, tnebUnder500: { ...draft.tnebUnder500, rate201to400: v } })
          }
        />
        <NumberField
          label="Rate 401–500 (Rs./unit)"
          value={draft.tnebUnder500.rate401to500}
          step={0.01}
          onChange={(v) =>
            setDraft({ ...draft, tnebUnder500: { ...draft.tnebUnder500, rate401to500: v } })
          }
        />
      </section>

      <section className="space-y-3 rounded-xl border border-border p-4">
        <h3 className="font-semibold text-ink">TNEB — consumption above 500 units</h3>
        <NumberField
          label="Free units up to"
          value={draft.tnebOver500.freeUpTo}
          onChange={(v) =>
            setDraft({ ...draft, tnebOver500: { ...draft.tnebOver500, freeUpTo: v } })
          }
        />
        {(
          [
            ["rate101to400", "101–400"],
            ["rate401to500", "401–500"],
            ["rate501to600", "501–600"],
            ["rate601to800", "601–800"],
            ["rate801to1000", "801–1000"],
            ["rate1001plus", "1001+"],
          ] as const
        ).map(([key, label]) => (
          <NumberField
            key={key}
            label={`Rate ${label} (Rs./unit)`}
            value={draft.tnebOver500[key]}
            step={0.01}
            onChange={(v) =>
              setDraft({
                ...draft,
                tnebOver500: { ...draft.tnebOver500, [key]: v },
              })
            }
          />
        ))}
      </section>

      <section className="space-y-3 rounded-xl border border-border p-4">
        <h3 className="font-semibold text-ink">Subsidy slabs</h3>
        <NumberField
          label="Tier 1 max kW"
          value={draft.subsidy.tier1MaxKw}
          step={0.1}
          onChange={(v) =>
            setDraft({ ...draft, subsidy: { ...draft.subsidy, tier1MaxKw: v } })
          }
        />
        <NumberField
          label="Tier 1 amount (Rs.)"
          value={draft.subsidy.tier1Amount}
          onChange={(v) =>
            setDraft({ ...draft, subsidy: { ...draft.subsidy, tier1Amount: v } })
          }
        />
        <NumberField
          label="Tier 2 max kW"
          value={draft.subsidy.tier2MaxKw}
          step={0.1}
          onChange={(v) =>
            setDraft({ ...draft, subsidy: { ...draft.subsidy, tier2MaxKw: v } })
          }
        />
        <NumberField
          label="Tier 2 amount (Rs.)"
          value={draft.subsidy.tier2Amount}
          onChange={(v) =>
            setDraft({ ...draft, subsidy: { ...draft.subsidy, tier2Amount: v } })
          }
        />
        <NumberField
          label="Tier 3 amount (Rs., 3 kW+)"
          value={draft.subsidy.tier3Amount}
          onChange={(v) =>
            setDraft({ ...draft, subsidy: { ...draft.subsidy, tier3Amount: v } })
          }
        />
      </section>

      <button type="button" onClick={() => void save()} className={btnPrimary}>
        Save settings
      </button>
      {saved && (
        <p className="text-sm text-green-700">
          Settings saved. New visitors will see these values on their next visit.
        </p>
      )}
      {saveError && <p className="text-sm text-red-600">{saveError}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [challenge, setChallenge] = useState(randomSixDigit);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setUnlocked(isAdminUnlocked());
    setReady(true);
  }, []);

  function tryUnlock(e: React.FormEvent) {
    e.preventDefault();
    const expected = challenge - 13;
    const trimmed = answer.trim();
    if (!/^\d+$/.test(trimmed)) {
      setError("Enter the decrypted number.");
      return;
    }
    if (parseInt(trimmed, 10) === expected) {
      setAdminUnlocked(true);
      void openAdminSession();
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect answer. Try again.");
      setChallenge(randomSixDigit());
      setAnswer("");
    }
  }

  function lock() {
    setAdminUnlocked(false);
    void closeAdminSession();
    setUnlocked(false);
    setChallenge(randomSixDigit());
    setAnswer("");
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-sm rounded-xl border border-border p-4 sm:p-6">
        <p className="text-sm text-ink-muted">Loading admin…</p>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-sm space-y-4 rounded-xl border border-border p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-ink">Admin access</h2>
        <p className="text-sm text-ink-muted">
          Decrypt:{" "}
          <strong className="font-mono text-xl tracking-wider text-accent">
            {challenge.toString().padStart(6, "0")}
          </strong>
        </p>

        <form onSubmit={tryUnlock} className="space-y-3">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            pattern="[0-9]*"
            value={answer}
            onChange={(e) => setAnswer(e.target.value.replace(/\D/g, ""))}
            placeholder="Decrypted number"
            className={inputClass}
            required
          />
          <button type="submit" className={btnPrimary}>
            Unlock dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-ink">Settings dashboard</h2>
        <button
          type="button"
          onClick={lock}
          className="text-sm text-ink-muted underline touch-manipulation"
        >
          Lock
        </button>
      </div>
      <AdminSettingsForm />
    </div>
  );
}
