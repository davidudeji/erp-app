"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import KpiCard, { type KpiCardProps } from "@/components/kpi-card";
import RevenueChart from "@/components/revenue-chart";
import SalesAnalytics from "@/components/sales-analytics";
import ActivityFeed from "@/components/activity-feed";
import AlertsPanel from "@/components/alerts-panel";
import CalendarWidget from "@/components/calendar-widget";
import AiAssistantPanel from "@/components/ai-assistant-panel";

/* ── KPI DATA ────────────────────────────────────────────── */
const kpiCards: Omit<KpiCardProps, "icon"> &
  { icon: React.ComponentType<{ className?: string }> }[] = [
  {
    title: "Total Revenue",
    value: "$124,650",
    daily: "$4,520",
    change: 12.5,
    sparkData: [32, 45, 41, 55, 48, 62, 70, 65, 80, 75, 92, 124],
    icon: DollarSign,
    accentColor: "#22d3ee",
    accentClass: "bg-cyan-400/10",
    iconColorClass: "text-cyan-400",
  },
  {
    title: "Total Orders",
    value: "1,245",
    daily: "42",
    change: 8.2,
    sparkData: [800, 860, 820, 900, 950, 920, 980, 1020, 1060, 1100, 1180, 1245],
    icon: ShoppingCart,
    accentColor: "#818cf8",
    accentClass: "bg-indigo-400/10",
    iconColorClass: "text-indigo-400",
  },
  {
    title: "Inventory Items",
    value: "3,456",
    subtitle: "Low stock: 12 items",
    change: -2.3,
    isPositive: false,
    sparkData: [3800, 3750, 3700, 3640, 3590, 3540, 3510, 3490, 3470, 3460, 3450, 3456],
    icon: Package,
    accentColor: "#f59e0b",
    accentClass: "bg-amber-400/10",
    iconColorClass: "text-amber-400",
  },
  {
    title: "Active Customers",
    value: "892",
    subtitle: "New this month: 28",
    change: 18.7,
    sparkData: [580, 620, 650, 680, 700, 720, 745, 760, 790, 820, 860, 892],
    icon: Users,
    accentColor: "#34d399",
    accentClass: "bg-emerald-400/10",
    iconColorClass: "text-emerald-400",
  },
  {
    title: "Profit Margin",
    value: "38.7%",
    subtitle: "Target: 40%",
    change: 3.1,
    sparkData: [32, 33, 31, 34, 35, 36, 35, 37, 36, 38, 39, 38.7],
    icon: TrendingUp,
    accentColor: "#a78bfa",
    accentClass: "bg-purple-400/10",
    iconColorClass: "text-purple-400",
  },
  {
    title: "Pending Invoices",
    value: "5",
    subtitle: "Total: $12,490",
    change: -40.0,
    isPositive: true, // fewer pending is positive
    sparkData: [12, 10, 14, 11, 9, 13, 8, 10, 7, 9, 6, 5],
    icon: FileText,
    accentColor: "#fb7185",
    accentClass: "bg-rose-400/10",
    iconColorClass: "text-rose-400",
  },
];

/* ── STAGGER VARIANTS ────────────────────────────────────── */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

/* ── DASHBOARD PAGE ──────────────────────────────────────── */
export default function DashboardPage() {
  return (
    <div className="space-y-6 p-5 md:p-7 max-w-[1600px] mx-auto">

      {/* ── PAGE HEADER ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            Welcome back, David! Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {/* AI Insight badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/10 to-indigo-400/10 px-4 py-2.5 backdrop-blur-xl cursor-pointer hover:border-cyan-400/40 transition-all"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
          <span className="text-sm text-cyan-200 font-medium">
            Revenue up 12.5% this month
          </span>
          <ArrowRight className="h-3.5 w-3.5 text-cyan-400/60" />
        </motion.div>
      </motion.div>

      {/* ── KPI CARDS ────────────────────────────────────── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
      >
        {kpiCards.map((card) => (
          <motion.div key={card.title} variants={item} className="xl:col-span-1">
            <KpiCard {...card} />
          </motion.div>
        ))}
      </motion.div>

      {/* ── REVENUE CHART ────────────────────────────────── */}
      <RevenueChart />

      {/* ── SALES ANALYTICS ──────────────────────────────── */}
      <SalesAnalytics />

      {/* ── ACTIVITY FEED ────────────────────────────────── */}
      <ActivityFeed />

      {/* ── BOTTOM ROW: Alerts | Calendar | AI Assistant ─── */}
      <div className="grid gap-4 xl:grid-cols-3">
        {/* Alerts Panel */}
        <AlertsPanel />

        {/* Calendar Widget */}
        <CalendarWidget />

        {/* AI Assistant */}
        <AiAssistantPanel />
      </div>

      {/* Bottom spacer for mobile */}
      <div className="h-4" />
    </div>
  );
}
