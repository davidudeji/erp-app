"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { Download, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── DATA ─────────────────────────────────────────────────── */
const revenueData = {
  "1M": [
    { month: "Week 1", revenue: 28000, profit: 9500 },
    { month: "Week 2", revenue: 33000, profit: 12000 },
    { month: "Week 3", revenue: 29500, profit: 10200 },
    { month: "Week 4", revenue: 34150, profit: 13400 },
  ],
  "3M": [
    { month: "Oct", revenue: 74000, profit: 28000 },
    { month: "Nov", revenue: 85000, profit: 33000 },
    { month: "Dec", revenue: 92000, profit: 38000 },
  ],
  "6M": [
    { month: "Jul", revenue: 65000, profit: 24000 },
    { month: "Aug", revenue: 70000, profit: 26500 },
    { month: "Sep", revenue: 75000, profit: 28000 },
    { month: "Oct", revenue: 74000, profit: 28000 },
    { month: "Nov", revenue: 85000, profit: 33000 },
    { month: "Dec", revenue: 92000, profit: 38000 },
  ],
  "1Y": [
    { month: "Jan", revenue: 32000, profit: 9000 },
    { month: "Feb", revenue: 45000, profit: 13000 },
    { month: "Mar", revenue: 55000, profit: 17500 },
    { month: "Apr", revenue: 48000, profit: 15000 },
    { month: "May", revenue: 62000, profit: 20000 },
    { month: "Jun", revenue: 70000, profit: 24000 },
    { month: "Jul", revenue: 65000, profit: 22000 },
    { month: "Aug", revenue: 80000, profit: 28000 },
    { month: "Sep", revenue: 75000, profit: 26000 },
    { month: "Oct", revenue: 85000, profit: 31000 },
    { month: "Nov", revenue: 95000, profit: 36000 },
    { month: "Dec", revenue: 124650, profit: 48000 },
  ],
};

type Range = "1M" | "3M" | "6M" | "1Y";

/* ── CUSTOM TOOLTIP ──────────────────────────────────────── */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#111f33]/95 backdrop-blur-xl p-3 shadow-2xl text-sm">
      <p className="font-semibold text-white mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span className="text-white/60 text-xs capitalize">{p.name}</span>
          </div>
          <span className="font-bold text-white text-xs">
            ${p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── REVENUE CHART ───────────────────────────────────────── */
export default function RevenueChart() {
  const [range, setRange] = useState<Range>("1Y");
  const data = revenueData[range];
  const lastVal = data[data.length - 1].revenue;
  const prevVal = data[0].revenue;
  const growthPct = (((lastVal - prevVal) / prevVal) * 100).toFixed(1);
  const positive = lastVal >= prevVal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-[--erp-border] bg-[--erp-bg-secondary] p-6"
      style={{ boxShadow: "var(--erp-shadow)" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
        <div>
          <h3 className="text-base font-semibold text-white">Revenue Analytics</h3>
          <p className="text-xs text-white/40 mt-0.5">Revenue & profit trends over time</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Range selectors */}
          <div className="flex items-center rounded-xl border border-[--erp-border] bg-white/[0.03] p-0.5">
            {(["1M", "3M", "6M", "1Y"] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={cn(
                  "rounded-lg px-3 py-1 text-xs font-medium transition-all",
                  range === r
                    ? "bg-cyan-400/15 text-cyan-300"
                    : "text-white/40 hover:text-white/70"
                )}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Growth badge */}
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
              positive
                ? "bg-emerald-400/10 text-emerald-400"
                : "bg-rose-400/10 text-rose-400"
            )}
          >
            <TrendingUp className="h-3 w-3" />
            {positive ? "+" : ""}
            {growthPct}% this period
          </div>

          {/* Export */}
          <button className="flex items-center gap-1.5 rounded-xl border border-[--erp-border] px-3 py-1.5 text-xs text-white/50 hover:bg-white/6 hover:text-white/80 transition-colors">
            <Download className="h-3 w-3" />
            Export
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }} />
            <Legend
              wrapperStyle={{ paddingTop: "12px" }}
              formatter={(value) => (
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>
                  {value}
                </span>
              )}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#22d3ee"
              strokeWidth={2}
              fill="url(#colorRevenue)"
              dot={false}
              activeDot={{ r: 4, fill: "#22d3ee", strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="profit"
              name="Profit"
              stroke="#818cf8"
              strokeWidth={2}
              fill="url(#colorProfit)"
              dot={false}
              activeDot={{ r: 4, fill: "#818cf8", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
