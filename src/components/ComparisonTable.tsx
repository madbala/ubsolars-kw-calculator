"use client";

import {
  rowDivider,
  sectionCardCompact,
  sectionTitle,
  tableClass,
  tableWrap,
  tdClass,
  thClass,
  theadClass,
} from "@/lib/ui";

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
    <div className={sectionCardCompact}>
      <h3 className={sectionTitle}>Before vs after solar</h3>
      <div className={tableWrap}>
        <table className={tableClass}>
          <thead className={theadClass}>
            <tr>
              <th className={thClass}>Metric</th>
              <th className={thClass}>Before solar</th>
              <th className={thClass}>After solar</th>
            </tr>
          </thead>
          <tbody>
            <tr className={rowDivider}>
              <td className={`${tdClass} font-medium`}>Units (bimonthly)</td>
              <td className={tdClass}>{unitsBefore}</td>
              <td className={tdClass}>{Math.round(unitsAfter)}</td>
            </tr>
            <tr className={rowDivider}>
              <td className={`${tdClass} font-medium`}>EB bill</td>
              <td className={tdClass}>{fmt(billBefore)}</td>
              <td className={tdClass}>{fmt(billAfter)}</td>
            </tr>
            <tr className={`${rowDivider} bg-green-50 font-semibold`}>
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
