"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

/* ── DATA ─────────────────────────────────────────────────── */
const topProducts = [
  { name: "Laptops Pro X", revenue: 42000, units: 142, color: "#22d3ee" },
  { name: "Office Chairs", revenue: 29000, units: 200, color: "#818cf8" },
  { name: "Monitors 4K", revenue: 24500, units: 67, color: "#34d399" },
  { name: "Keyboards", revenue: 18000, units: 300, color: "#fbbf24" },
  { name: "Headphones", revenue: 14200, units: 95, color: "#f472b6" },
];

const conversionData = [
  { stage: "Leads", value: 1240, fill: "#22d3ee" },
  { stage: "Qualified", value: 870, fill: "#818cf8" },
  { stage: "Proposal", value: 530, fill: "#34d399" },
  { stage: "Closed", value: 310, fill: "#fbbf24" },
];

function CustomBarTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#111f33]/95 backdrop-blur-xl p-3 shadow-2xl text-xs">
      <p className="font-semibold text-white mb-1">{label}</p>
      <p className="text-white/60">
        Revenue:{" "}
        <span className="text-white font-bold">
          ${payload[0].value.toLocaleString()}
        </span>
      </p>
    </div>
  );
}

/* ── SALES ANALYTICS ─────────────────────────────────────── */
export default function SalesAnalytics() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {/* Top Products Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl border border-[--erp-border] bg-[--erp-bg-secondary] p-6"
        style={{ boxShadow: "var(--erp-shadow)" }}
      >
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white">Top Products</h3>
          <p className="text-xs text-white/40 mt-0.5">By revenue this month</p>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topProducts}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              barCategoryGap="20%"
            >
              <XAxis
                type="number"
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={88}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                {topProducts.map((entry, i) => (
                  <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 space-y-2">
          {topProducts.map((p) => (
            <div key={p.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{ background: p.color }}
                />
                <span className="text-white/60 truncate">{p.name}</span>
              </div>
              <div className="flex items-center gap-3 ml-3">
                <span className="text-white/40">{p.units} units</span>
                <span className="font-semibold text-white">
                  ${(p.revenue / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sales Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-2xl border border-[--erp-border] bg-[--erp-bg-secondary] p-6"
        style={{ boxShadow: "var(--erp-shadow)" }}
      >
        <div className="mb-5">
          <h3 className="text-base font-semibold text-white">Sales Funnel</h3>
          <p className="text-xs text-white/40 mt-0.5">Conversion by pipeline stage</p>
        </div>

        <div className="h-40 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conversionData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="stage"
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
                contentStyle={{
                  background: "rgba(17,31,51,0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {conversionData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Win Rate", value: "25%", color: "text-emerald-400" },
            { label: "Avg Deal", value: "$4,280", color: "text-cyan-400" },
            { label: "Cycle Time", value: "18 days", color: "text-indigo-400" },
            { label: "Pipeline", value: "$2.1M", color: "text-amber-400" },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-xl bg-white/[0.03] border border-[--erp-border] p-3"
            >
              <p className="text-[10px] text-white/40 mb-1">{m.label}</p>
              <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
