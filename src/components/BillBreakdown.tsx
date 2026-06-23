"use client";

import { useState } from "react";
import { useCalculator } from "@/context/CalculatorContext";
import { calculateEnergyCharge, unitsToSlabBreakdown } from "@/utils/calculations";
import { TNEB_TARIFF_FOOTNOTE } from "@/utils/tnebTariff";
import {
  mutedText,
  rowDivider,
  tableClass,
  tableWrap,
  tdClass,
  thClass,
  theadClass,
} from "@/lib/ui";

type Props = {
  units: number;
};

export default function BillBreakdown({ units }: Props) {
  const { settings } = useCalculator();
  const [open, setOpen] = useState(false);
  const breakdown = unitsToSlabBreakdown(units, settings);

  if (breakdown.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full min-h-11 items-center justify-between px-4 py-3 text-left text-sm font-semibold text-ink touch-manipulation"
      >
        Bill breakdown
        <span className="text-ink-subtle">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className={`${tableWrap} border-t border-border`}>
          <table className={tableClass}>
            <thead className={theadClass}>
              <tr>
                <th className={thClass}>Slab</th>
                <th className={thClass}>Units</th>
                <th className={thClass}>Rate</th>
                <th className={thClass}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((row) => (
                <tr key={row.range} className={rowDivider}>
                  <td className={tdClass}>{row.range}</td>
                  <td className={tdClass}>{row.unitsInSlab}</td>
                  <td className={tdClass}>₹{row.rate}</td>
                  <td className={tdClass}>₹{row.charge.toFixed(2)}</td>
                </tr>
              ))}
              <tr className={`${rowDivider} font-semibold`}>
                <td className={tdClass} colSpan={3}>
                  Total energy charge
                </td>
                <td className={tdClass}>
                  ₹{calculateEnergyCharge(units, settings).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
          <p className={`px-4 py-2 ${mutedText}`}>{TNEB_TARIFF_FOOTNOTE}</p>
        </div>
      )}
    </div>
  );
}
