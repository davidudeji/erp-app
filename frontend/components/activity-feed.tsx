"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Package,
  Users,
  ShoppingCart,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── DATA ─────────────────────────────────────────────────── */
const recentOrders = [
  { id: "#ORD-1250", customer: "Acme Corporation", amount: "$1,250.00", status: "completed", date: "Jun 24, 2025" },
  { id: "#ORD-1249", customer: "Globex Industries", amount: "$980.00", status: "processing", date: "Jun 24, 2025" },
  { id: "#ORD-1248", customer: "Stark Enterprises", amount: "$2,450.00", status: "pending", date: "Jun 23, 2025" },
  { id: "#ORD-1247", customer: "Wayne Enterprises", amount: "$1,100.00", status: "completed", date: "Jun 23, 2025" },
  { id: "#ORD-1246", customer: "Umbrella Corp", amount: "$750.00", status: "cancelled", date: "Jun 22, 2025" },
];

const recentActivity = [
  { id: "1", icon: FileText, label: "Invoice #INV-202 created", time: "2m ago", type: "invoice", color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "2", icon: Package, label: 'New product "MacBook Pro" added', time: "15m ago", type: "product", color: "text-purple-400", bg: "bg-purple-400/10" },
  { id: "3", icon: Users, label: 'Customer "John Doe" registered', time: "1h ago", type: "customer", color: "text-amber-400", bg: "bg-amber-400/10" },
  { id: "4", icon: CreditCard, label: "Payment received from Acme Corp", time: "2h ago", type: "payment", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { id: "5", icon: Package, label: 'Stock updated for "Office Chairs"', time: "3h ago", type: "inventory", color: "text-cyan-400", bg: "bg-cyan-400/10" },
];

const statusStyles: Record<string, { label: string; cls: string }> = {
  completed:  { label: "Completed",  cls: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
  processing: { label: "Processing", cls: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20" },
  pending:    { label: "Pending",    cls: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
  cancelled:  { label: "Cancelled",  cls: "bg-rose-400/10 text-rose-400 border-rose-400/20" },
};

/* ── ACTIVITY FEED ───────────────────────────────────────── */
export default function ActivityFeed() {
  return (
    <div className="grid gap-4 xl:grid-cols-5">
      {/* Recent Orders — 3/5 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="xl:col-span-3 rounded-2xl border border-[--erp-border] bg-[--erp-bg-secondary] p-6"
        style={{ boxShadow: "var(--erp-shadow)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-white">Recent Orders</h3>
            <p className="text-xs text-white/40 mt-0.5">Latest sales transactions</p>
          </div>
          <button className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[--erp-border]">
                {["Order ID", "Customer", "Amount", "Status", "Date"].map((h) => (
                  <th key={h} className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-white/30">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[--erp-border]">
              {recentOrders.map((order, i) => {
                const s = statusStyles[order.status];
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.06 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <span className="font-mono text-xs text-cyan-400">{order.id}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-white/80 font-medium">{order.customer}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="font-semibold text-white">{order.amount}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold", s.cls)}>
                        {s.label}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="text-xs text-white/40">{order.date}</span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent Activity — 2/5 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="xl:col-span-2 rounded-2xl border border-[--erp-border] bg-[--erp-bg-secondary] p-6"
        style={{ boxShadow: "var(--erp-shadow)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-white">Recent Activity</h3>
            <p className="text-xs text-white/40 mt-0.5">System-wide events</p>
          </div>
          <button className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-3">
          {recentActivity.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 group"
              >
                <div className={cn("flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl", item.bg)}>
                  <Icon className={cn("h-3.5 w-3.5", item.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70 leading-snug group-hover:text-white/90 transition-colors truncate">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-white/30 mt-0.5">{item.time}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
