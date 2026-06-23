"use client";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const data = [42000, 68000, 55000, 89000, 74000, 105000, 124650];
const maxVal = Math.max(...data);

export default function RevenueChart() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
          <p className="mt-1 text-sm text-gray-400">Monthly revenue for 2025</p>
        </div>
        <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          +12.5%
        </div>
      </div>

      <div className="flex h-48 items-end gap-3">
        {data.map((val, i) => {
          const height = (val / maxVal) * 100;
          return (
            <div key={i} className="group relative flex flex-1 flex-col items-center gap-2">
              <div
                style={{ height: `${height}%` }}
                className="w-full rounded-t-lg bg-gradient-to-t from-cyan-600/40 to-cyan-400 transition-all duration-300 group-hover:to-cyan-300"
              />
              <span className="text-xs text-gray-500">{months[i]}</span>
              {/* Tooltip */}
              <div className="absolute -top-8 hidden rounded bg-[#0b1f2e] border border-white/10 px-2 py-1 text-xs text-white group-hover:block">
                ${(val / 1000).toFixed(0)}k
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
