"use client";

import type { SolarScoreLevel } from "@/utils/calculations";
import { mutedText, sectionCardCompact, sectionTitle } from "@/lib/ui";

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
    className: "bg-accent-light text-accent-dark ring-accent/40",
  },
  not_ideal: {
    label: "Not Ideal",
    className: "bg-surface-muted text-ink-muted ring-border",
  },
};

export default function SolarScore({ score }: Props) {
  const { label, className } = CONFIG[score];

  return (
    <div className={`${sectionCardCompact} flex flex-col items-center gap-2`}>
      <h3 className={sectionTitle}>Solar recommendation score</h3>
      <span
        className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ring-1 ${className}`}
      >
        {label}
      </span>
      <p className={`text-center ${mutedText}`}>
        Based on consumption and roof suitability
      </p>
    </div>
  );
}
