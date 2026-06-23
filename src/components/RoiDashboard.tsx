"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { RoiResult } from "@/utils/calculations";
import { statCard, statLabel, statValue, sectionCard, sectionTitle } from "@/lib/ui";

type Props = {
  roi: RoiResult;
  roiYears: number;
};

export default function RoiDashboard({ roi, roiYears }: Props) {
  const chartData = roi.yearlySavings.map((y) => ({
    year: y.year,
    cumulative: Math.round(y.cumulative),
  }));

  return (
    <div className={sectionCard}>
      <h3 className={sectionTitle}>ROI dashboard</h3>

      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
        <div className={statCard}>
          <p className={statLabel}>Payback period</p>
          <p className={statValue}>
            {roi.paybackYears > 0 && roi.paybackYears < roiYears
              ? `${roi.paybackYears.toFixed(1)} yrs`
              : `${roiYears}+ yrs`}
          </p>
        </div>
        <div className={statCard}>
          <p className={statLabel}>{roiYears}-year savings</p>
          <p className={`${statValue} text-green-700`}>
            ₹{Math.round(roi.totalSavings25Years).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="h-56 w-full min-w-0 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11 }}
              label={{ value: "Year", position: "insideBottom", offset: -4, fontSize: 11 }}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              width={48}
            />
            <Tooltip
              formatter={(value) => [
                `₹${Number(value ?? 0).toLocaleString("en-IN")}`,
                "Cumulative",
              ]}
              labelFormatter={(y) => `Year ${y}`}
            />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
