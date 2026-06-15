"use client";

import type { SolarScoreLevel } from "@/utils/calculations";

type Props = {
  score: SolarScoreLevel;
};

const CONFIG: Record<
  SolarScoreLevel,
  { label: string; className: string }
> = {
  highly: {
    label: "Highly Recommended",
    className: "bg-green-100 text-green-800 ring-green-300",
  },
  moderate: {
    label: "Moderate Benefit",
    className: "bg-amber-100 text-amber-800 ring-amber-300",
  },
  not_ideal: {
    label: "Not Ideal",
    className: "bg-slate-100 text-slate-600 ring-slate-300",
  },
};

export default function SolarScore({ score }: Props) {
  const { label, className } = CONFIG[score];

  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <h3 className="font-semibold text-slate-800">Solar recommendation score</h3>
      <span
        className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ring-1 ${className}`}
      >
        {label}
      </span>
      <p className="text-center text-xs text-slate-500">
        Based on consumption and roof suitability
      </p>
    </div>
  );
}
