"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Package,
  FileText,
  CreditCard,
  CalendarClock,
  X,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── DATA ─────────────────────────────────────────────────── */
type Priority = "critical" | "warning" | "info";

interface Alert {
  id: string;
  priority: Priority;
  title: string;
  desc: string;
  icon: React.ElementType;
  action?: string;
  time: string;
}

const alerts: Alert[] = [
  {
    id: "1",
    priority: "critical",
    title: "Low Stock Warning",
    desc: "12 items are running critically low. Reorder needed.",
    icon: Package,
    action: "Reorder Now",
    time: "2m ago",
  },
  {
    id: "2",
    priority: "critical",
    title: "Failed Payment",
    desc: "Payment of $3,200 from Globex Industries failed.",
    icon: CreditCard,
    action: "Retry Payment",
    time: "15m ago",
  },
  {
    id: "3",
    priority: "warning",
    title: "Overdue Invoices",
    desc: "5 invoices totalling $8,450 are overdue.",
    icon: FileText,
    action: "View Invoices",
    time: "1h ago",
  },
  {
    id: "4",
    priority: "warning",
    title: "Expiring Subscriptions",
    desc: "3 customer subscriptions expire in 7 days.",
    icon: CalendarClock,
    action: "Send Reminders",
    time: "2h ago",
  },
  {
    id: "5",
    priority: "info",
    title: "New Report Ready",
    desc: "Monthly financial report for June is available.",
    icon: Info,
    action: "View Report",
    time: "3h ago",
  },
];

const priorityConfig: Record<Priority, {
  icon: React.ElementType;
  dot: string;
  border: string;
  bg: string;
  text: string;
  label: string;
}> = {
  critical: {
    icon: AlertCircle,
    dot: "bg-rose-400",
    border: "border-rose-400/20",
    bg: "bg-rose-400/8",
    text: "text-rose-400",
    label: "Critical",
  },
  warning: {
    icon: AlertTriangle,
    dot: "bg-amber-400",
    border: "border-amber-400/20",
    bg: "bg-amber-400/8",
    text: "text-amber-400",
    label: "Warning",
  },
  info: {
    icon: Info,
    dot: "bg-blue-400",
    border: "border-blue-400/20",
    bg: "bg-blue-400/8",
    text: "text-blue-400",
    label: "Info",
  },
};

/* ── ALERTS PANEL ────────────────────────────────────────── */
export default function AlertsPanel() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<Priority | "all">("all");

  const visible = alerts.filter(
    (a) => !dismissed.has(a.id) && (filter === "all" || a.priority === filter)
  );

  const counts = {
    critical: alerts.filter((a) => a.priority === "critical" && !dismissed.has(a.id)).length,
    warning:  alerts.filter((a) => a.priority === "warning"  && !dismissed.has(a.id)).length,
    info:     alerts.filter((a) => a.priority === "info"     && !dismissed.has(a.id)).length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-[--erp-border] bg-[--erp-bg-secondary] p-6"
      style={{ boxShadow: "var(--erp-shadow)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Smart Alerts</h3>
          <p className="text-xs text-white/40 mt-0.5">
            {visible.length} active alert{visible.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
          View all →
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <FilterPill label="All" active={filter === "all"} onClick={() => setFilter("all")} />
        {(["critical", "warning", "info"] as Priority[]).map((p) => {
          const cfg = priorityConfig[p];
          return (
            <FilterPill
              key={p}
              label={cfg.label}
              count={counts[p]}
              active={filter === p}
              dotColor={cfg.dot}
              onClick={() => setFilter(p)}
            />
          );
        })}
      </div>

      {/* Alert Items */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {visible.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <div className="h-10 w-10 rounded-full bg-emerald-400/10 flex items-center justify-center mb-3">
                <Info className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="text-sm text-white/50">All clear! No active alerts.</p>
            </motion.div>
          ) : (
            visible.map((alert) => {
              const cfg = priorityConfig[alert.priority];
              const PIcon = cfg.icon;
              const AIcon = alert.icon;

              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "group relative rounded-xl border p-4 transition-colors hover:brightness-110",
                    cfg.border,
                    cfg.bg
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={cn("flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg", `bg-${alert.priority === "critical" ? "rose" : alert.priority === "warning" ? "amber" : "blue"}-400/15`)}>
                      <AIcon className={cn("h-4 w-4", cfg.text)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider", cfg.text)}>
                          {cfg.label}
                        </span>
                        <span className="text-[10px] text-white/30">{alert.time}</span>
                      </div>
                      <p className="text-sm font-semibold text-white/90 mb-0.5">{alert.title}</p>
                      <p className="text-[11px] text-white/50 leading-relaxed">{alert.desc}</p>
                      {alert.action && (
                        <button className={cn("mt-2 flex items-center gap-1 text-xs font-semibold", cfg.text, "hover:underline")}>
                          {alert.action}
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {/* Dismiss */}
                    <button
                      onClick={() => setDismissed((prev) => new Set([...prev, alert.id]))}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-white/70"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function FilterPill({
  label,
  count,
  active,
  dotColor,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  dotColor?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all",
        active
          ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
          : "border-[--erp-border] text-white/40 hover:text-white/70 hover:border-white/20"
      )}
    >
      {dotColor && (
        <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", dotColor)} />
      )}
      {label}
      {count !== undefined && count > 0 && (
        <span className="ml-0.5 rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-bold">
          {count}
        </span>
      )}
    </button>
  );
}
