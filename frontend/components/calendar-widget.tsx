"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Users, Package, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── CALENDAR HELPERS ────────────────────────────────────── */
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const events = [
  { date: 20, label: "Team Meeting", time: "10:00 AM", icon: Users, color: "text-indigo-400", bg: "bg-indigo-400/10" },
  { date: 20, label: "Client Appointment", time: "2:00 PM", icon: CalendarCheck, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { date: 21, label: "Product Delivery", time: "11:00 AM", icon: Package, color: "text-amber-400", bg: "bg-amber-400/10" },
  { date: 25, label: "Investor Call", time: "3:00 PM", icon: Users, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { date: 28, label: "Inventory Audit", time: "9:00 AM", icon: Package, color: "text-purple-400", bg: "bg-purple-400/10" },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

/* ── CALENDAR WIDGET ─────────────────────────────────────── */
export default function CalendarWidget() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const isCurrentMonth = viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const eventDates = new Set(events.map((e) => e.date));
  const upcomingEvents = events.filter((e) => e.date >= (isCurrentMonth ? today.getDate() : 1)).slice(0, 4);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="rounded-2xl border border-[--erp-border] bg-[--erp-bg-secondary] p-6"
      style={{ boxShadow: "var(--erp-shadow)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Calendar</h3>
          <p className="text-xs text-white/40 mt-0.5">Upcoming schedule</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-white/40 hover:bg-white/8 hover:text-white/80 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="text-xs font-medium text-white/70 w-24 text-center">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button
            onClick={nextMonth}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-white/40 hover:bg-white/8 hover:text-white/80 transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[9px] font-semibold uppercase tracking-widest text-white/25 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const isToday = isCurrentMonth && day === today.getDate();
          const hasEvent = eventDates.has(day);

          return (
            <div key={day} className="flex flex-col items-center">
              <button
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-medium transition-all",
                  isToday
                    ? "bg-cyan-400 text-[#060d17] font-bold shadow-lg shadow-cyan-400/30"
                    : "text-white/50 hover:bg-white/8 hover:text-white/90"
                )}
              >
                {day}
              </button>
              {hasEvent && (
                <div
                  className={cn(
                    "mt-0.5 h-1 w-1 rounded-full",
                    isToday ? "bg-white/60" : "bg-cyan-400"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-[--erp-border]" />

      {/* Upcoming Events */}
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Upcoming
        </p>
        <div className="space-y-2.5">
          {upcomingEvents.map((ev, i) => {
            const Icon = ev.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className={cn("flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg", ev.bg)}>
                  <Icon className={cn("h-3.5 w-3.5", ev.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white/80 truncate">{ev.label}</p>
                  <p className="text-[10px] text-white/35">Jun {ev.date} · {ev.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button className="mt-4 w-full text-center text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors">
          View all events →
        </button>
      </div>
    </motion.div>
  );
}
