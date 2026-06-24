"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

/* ── SPARKLINE ───────────────────────────────────────────── */
function Sparkline({
  data,
  color,
  height = 36,
}: {
  data: number[];
  color: string;
  height?: number;
}) {
  const w = 80;
  const h = height;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });

  const path = `M${points.join(" L")}`;
  const fillPath = `M0,${h} L${points.join(" L")} L${w},${h} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`fill-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#fill-${color})`} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last point dot */}
      <circle
        cx={w}
        cy={parseFloat(points[points.length - 1].split(",")[1])}
        r="2.5"
        fill={color}
        className="drop-shadow-sm"
      />
    </svg>
  );
}

/* ── ANIMATED COUNTER ────────────────────────────────────── */
function AnimatedValue({ value }: { value: string }) {
  const [displayed, setDisplayed] = useState("0");
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) return;
    hasMounted.current = true;

    const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(numeric)) { setDisplayed(value); return; }

    const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
    const suffix = value.match(/[^0-9.]+$/)?.[0] ?? "";
    const decimals = (value.split(".")[1] ?? "").length;
    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * numeric;
      setDisplayed(
        prefix +
          current.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }) +
          suffix
      );
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value]);

  return <span>{displayed}</span>;
}

/* ── KPI CARD ────────────────────────────────────────────── */
export interface KpiCardProps {
  title: string;
  value: string;
  daily?: string;
  change: number; // percent
  sparkData: number[];
  icon: LucideIcon;
  accentColor: string;   // hex color for sparkline + glow
  accentClass: string;   // tailwind class for icon bg
  iconColorClass: string; // tailwind class for icon color
  isPositive?: boolean;
  subtitle?: string;
}

export default function KpiCard({
  title,
  value,
  daily,
  change,
  sparkData,
  icon: Icon,
  accentColor,
  accentClass,
  iconColorClass,
  isPositive,
  subtitle,
}: KpiCardProps) {
  const positive = isPositive ?? change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl border border-[--erp-border] bg-[--erp-bg-secondary] p-5 cursor-default group"
      style={{ boxShadow: "var(--erp-shadow)" }}
    >
      {/* Subtle glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{
          background: `radial-gradient(circle at top right, ${accentColor}15 0%, transparent 60%)`,
        }}
      />

      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", accentClass)}>
          <Icon className={cn("h-4.5 w-4.5", iconColorClass)} style={{ height: "18px", width: "18px" }} />
        </div>
        <Sparkline data={sparkData} color={accentColor} />
      </div>

      {/* Value */}
      <div className="mb-1">
        <p className="text-xs font-medium text-white/40 mb-1">{title}</p>
        <p className="text-2xl font-bold text-white leading-tight tracking-tight">
          <AnimatedValue value={value} />
        </p>
      </div>

      {/* Daily + change */}
      <div className="flex items-center justify-between mt-3">
        {daily && (
          <span className="text-[11px] text-white/40">
            Today: <span className="text-white/60 font-medium">{daily}</span>
          </span>
        )}
        {subtitle && !daily && (
          <span className="text-[11px] text-white/40">{subtitle}</span>
        )}
        <div
          className={cn(
            "flex items-center gap-1 text-[11px] font-semibold rounded-full px-2 py-0.5",
            positive
              ? "bg-emerald-400/10 text-emerald-400"
              : "bg-rose-400/10 text-rose-400"
          )}
        >
          {positive ? (
            <TrendingUp className="h-2.5 w-2.5" />
          ) : (
            <TrendingDown className="h-2.5 w-2.5" />
          )}
          {positive ? "+" : ""}
          {change.toFixed(1)}%
        </div>
      </div>
    </motion.div>
  );
}
