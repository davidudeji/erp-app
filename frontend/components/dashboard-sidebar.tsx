"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  FileText,
  Tag,
  Package,
  Tags,
  ArrowLeftRight,
  Truck,
  Warehouse,
  Receipt,
  CreditCard,
  Wallet,
  ArrowUpDown,
  BarChart2,
  PieChart,
  LineChart,
  UserCheck,
  Target,
  Activity,
  MessageSquareMore,
  ScanLine,
  Lightbulb,
  TrendingUp,
  Shield,
  ScrollText,
  Settings,
  Boxes,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Store,
} from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

/* ── NAV STRUCTURE ──────────────────────────────────────── */
const navGroups = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Sales",
    items: [
      {
        title: "Sales Orders",
        href: "/dashboard/sales-orders",
        icon: ShoppingCart,
      },
      { title: "Customers", href: "/dashboard/customers", icon: Users },
      {
        title: "Quotations",
        href: "/dashboard/quotations",
        icon: ClipboardList,
      },
      { title: "Point of Sale", href: "/dashboard/pos", icon: Store },
    ],
  },
  {
    label: "Inventory",
    items: [
      { title: "Products", href: "/dashboard/products", icon: Package },
      { title: "Categories", href: "/dashboard/categories", icon: Tags },
      {
        title: "Stock Movements",
        href: "/dashboard/stock",
        icon: ArrowLeftRight,
      },
      { title: "Suppliers", href: "/dashboard/suppliers", icon: Truck },
      { title: "Warehouses", href: "/dashboard/warehouses", icon: Warehouse },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Invoices", href: "/dashboard/invoices", icon: FileText },
      { title: "Payments", href: "/dashboard/payments", icon: CreditCard },
      { title: "Expenses", href: "/dashboard/expenses", icon: Wallet },
      {
        title: "Transactions",
        href: "/dashboard/transactions",
        icon: ArrowUpDown,
      },
    ],
  },
  {
    label: "Reports",
    items: [
      {
        title: "Sales Reports",
        href: "/dashboard/reports/sales",
        icon: BarChart2,
      },
      {
        title: "Inventory Reports",
        href: "/dashboard/reports/inventory",
        icon: PieChart,
      },
      {
        title: "Financial Reports",
        href: "/dashboard/reports/finance",
        icon: LineChart,
      },
      {
        title: "Customer Reports",
        href: "/dashboard/reports/customers",
        icon: UserCheck,
      },
    ],
  },
  {
    label: "CRM",
    items: [
      { title: "Leads", href: "/dashboard/crm/leads", icon: Target },
      {
        title: "Opportunities",
        href: "/dashboard/crm/opportunities",
        icon: TrendingUp,
      },
      {
        title: "Activities",
        href: "/dashboard/crm/activities",
        icon: Activity,
      },
    ],
  },
  {
    label: "AI Assistant",
    accent: true,
    items: [
      {
        title: "ERP Chat",
        href: "/dashboard/ai/chat",
        icon: MessageSquareMore,
      },
      { title: "OCR Processing", href: "/dashboard/ai/ocr", icon: ScanLine },
      { title: "Insights", href: "/dashboard/ai/insights", icon: Lightbulb },
      {
        title: "Forecasting",
        href: "/dashboard/ai/forecasting",
        icon: TrendingUp,
      },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Users", href: "/dashboard/users", icon: Users },
      { title: "Roles & Permissions", href: "/dashboard/roles", icon: Shield },
      { title: "Audit Logs", href: "/dashboard/audit-logs", icon: ScrollText },
      { title: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

/* ── SIDEBAR ────────────────────────────────────────────── */
export default function DashboardSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed } = useUIStore();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {};
    navGroups.forEach((g) => (defaults[g.label] = true));
    return defaults;
  });

  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-[--erp-border] bg-[--erp-bg-secondary] sidebar-transition overflow-hidden flex-shrink-0",
        sidebarCollapsed ? "w-[64px]" : "w-[240px]",
      )}
    >
      {/* LOGO */}
      <div className="flex h-16 items-center gap-3 border-b border-[--erp-border] px-4 flex-shrink-0">
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-md" />
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10">
            <Boxes className="h-4 w-4 text-cyan-300" />
          </div>
        </div>
        <AnimatePresence mode="wait">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm font-bold text-white leading-tight">
                ERP Suite
              </p>
              <p className="text-[10px] text-white/40">Enterprise OS</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* WORKSPACE SELECTOR */}
      {!sidebarCollapsed && (
        <div className="px-3 py-2 border-b border-[--erp-border]">
          <button className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-gradient-to-br from-indigo-400 to-cyan-400 flex-shrink-0" />
              <span className="text-white/80 font-medium truncate">
                Company Logo
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-white/40 flex-shrink-0" />
          </button>
        </div>
      )}

      {/* NAV ITEMS */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navGroups.map((group) => (
          <NavGroup
            key={group.label}
            group={group}
            isOpen={openGroups[group.label] ?? true}
            onToggle={() => toggleGroup(group.label)}
            pathname={pathname}
            collapsed={sidebarCollapsed}
          />
        ))}
      </nav>

      {/* FOOTER */}
      <div className="border-t border-[--erp-border] p-3">
        {sidebarCollapsed ? (
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5 cursor-pointer transition-colors">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                David Admin
              </p>
              <p className="text-[10px] text-white/40 truncate">
                Administrator
              </p>
            </div>
            <Receipt className="h-4 w-4 text-white/30 flex-shrink-0" />
          </div>
        )}
      </div>
    </aside>
  );
}

/* ── NAV GROUP ──────────────────────────────────────────── */
function NavGroup({
  group,
  isOpen,
  onToggle,
  pathname,
  collapsed,
}: {
  group: (typeof navGroups)[0];
  isOpen: boolean;
  onToggle: () => void;
  pathname: string;
  collapsed: boolean;
}) {
  const hasActive = group.items.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
  );

  return (
    <div className="mb-1">
      {!collapsed && (
        <button
          onClick={onToggle}
          className={cn(
            "flex w-full items-center justify-between px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest transition-colors",
            group.accent
              ? "text-cyan-400/70 hover:text-cyan-400"
              : "text-white/30 hover:text-white/50",
          )}
        >
          <span>{group.label}</span>
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform duration-200",
              isOpen ? "rotate-0" : "-rotate-90",
            )}
          />
        </button>
      )}

      <AnimatePresence initial={false}>
        {(isOpen || collapsed) && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden space-y-0.5"
          >
            {group.items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={collapsed ? item.title : undefined}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                      collapsed ? "justify-center px-0" : "",
                      isActive
                        ? "bg-cyan-400/10 text-cyan-300 shadow-sm"
                        : "text-white/50 hover:bg-white/5 hover:text-white/90",
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 w-0.5 h-6 bg-cyan-400 rounded-r-full" />
                    )}
                    <Icon
                      className={cn(
                        "h-4 w-4 flex-shrink-0 transition-colors",
                        isActive
                          ? "text-cyan-300"
                          : group.accent
                            ? "text-cyan-400/60 group-hover:text-cyan-400"
                            : "text-white/40 group-hover:text-white/80",
                      )}
                    />
                    {!collapsed && (
                      <span className="truncate font-medium">{item.title}</span>
                    )}
                    {isActive && !collapsed && (
                      <ChevronRight className="ml-auto h-3.5 w-3.5 text-cyan-400/50" />
                    )}
                  </Link>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
