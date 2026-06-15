"use client";

import { tableClass, tableWrap, tdClass, thClass } from "@/lib/ui";

type Props = {
  unitsBefore: number;
  unitsAfter: number;
  billBefore: number;
  billAfter: number;
  savings: number;
};

export default function ComparisonTable({
  unitsBefore,
  unitsAfter,
  billBefore,
  billAfter,
  savings,
}: Props) {
  const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <h3 className="mb-3 font-semibold text-slate-800">Before vs after solar</h3>
      <div className={tableWrap}>
        <table className={tableClass}>
          <thead className="bg-slate-50">
            <tr>
              <th className={thClass}>Metric</th>
              <th className={thClass}>Before solar</th>
              <th className={thClass}>After solar</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-100">
              <td className={`${tdClass} font-medium`}>Units (bimonthly)</td>
              <td className={tdClass}>{unitsBefore}</td>
              <td className={tdClass}>{Math.round(unitsAfter)}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className={`${tdClass} font-medium`}>EB bill</td>
              <td className={tdClass}>{fmt(billBefore)}</td>
              <td className={tdClass}>{fmt(billAfter)}</td>
            </tr>
            <tr className="border-t border-slate-200 bg-green-50 font-semibold">
              <td className={tdClass}>Savings</td>
              <td className={tdClass}>—</td>
              <td className={`${tdClass} text-green-700`}>{fmt(savings)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
