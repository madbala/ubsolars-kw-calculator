"use client";

import { useState } from "react";
import { useCalculator } from "@/context/CalculatorContext";
import { calculateEnergyCharge, unitsToSlabBreakdown } from "@/utils/calculations";
import { tableClass, tableWrap, tdClass, thClass } from "@/lib/ui";

type Props = {
  units: number;
};

export default function BillBreakdown({ units }: Props) {
  const { settings } = useCalculator();
  const [open, setOpen] = useState(false);
  const breakdown = unitsToSlabBreakdown(units, settings);

  if (breakdown.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full min-h-11 items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-800 touch-manipulation"
      >
        Bill breakdown
        <span className="text-slate-400">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className={`${tableWrap} border-t border-slate-200`}>
          <table className={tableClass}>
            <thead className="bg-slate-50">
              <tr>
                <th className={thClass}>Slab</th>
                <th className={thClass}>Units</th>
                <th className={thClass}>Rate</th>
                <th className={thClass}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((row) => (
                <tr key={row.range} className="border-t border-slate-100">
                  <td className={tdClass}>{row.range}</td>
                  <td className={tdClass}>{row.unitsInSlab}</td>
                  <td className={tdClass}>₹{row.rate}</td>
                  <td className={tdClass}>₹{row.charge.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="border-t border-slate-200 font-semibold">
                <td className={tdClass} colSpan={3}>Total energy charge</td>
                <td className={tdClass}>
                  ₹{calculateEnergyCharge(units, settings).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
