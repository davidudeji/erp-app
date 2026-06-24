"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PanelLeft,
  Search,
  Bell,
  Plus,
  Sun,
  Moon,
  ChevronDown,
  X,
  Zap,
  FileText,
  Package,
  Users,
  ShoppingCart,
  Command,
  AlertTriangle,
  AlertCircle,
  Info,
  Check,
  LogOut,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

/* ── QUICK ACTIONS ──────────────────────────────────────── */
const quickActions = [
  { label: "New Invoice", icon: FileText, shortcut: "⌘N", color: "text-blue-400" },
  { label: "Add Product", icon: Package, shortcut: "⌘P", color: "text-purple-400" },
  { label: "Create Order", icon: ShoppingCart, shortcut: "⌘O", color: "text-emerald-400" },
  { label: "Add Customer", icon: Users, shortcut: "⌘C", color: "text-amber-400" },
];

/* ── NOTIFICATIONS ──────────────────────────────────────── */
const notifications = [
  {
    id: "1",
    type: "critical",
    title: "Low Stock Alert",
    desc: "12 items are running critically low",
    time: "2m ago",
    read: false,
  },
  {
    id: "2",
    type: "warning",
    title: "Pending Invoices",
    desc: "5 invoices are overdue for payment",
    time: "15m ago",
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Overdue Payments",
    desc: "3 payments are 7+ days overdue",
    time: "1h ago",
    read: false,
  },
  {
    id: "4",
    type: "info",
    title: "Report Ready",
    desc: "Monthly financial report is generated",
    time: "2h ago",
    read: true,
  },
  {
    id: "5",
    type: "info",
    title: "New Customer",
    desc: "Acme Corporation registered",
    time: "3h ago",
    read: true,
  },
];

const notifTypeStyles = {
  critical: {
    icon: AlertCircle,
    dot: "bg-rose-400",
    iconClass: "text-rose-400",
    bg: "bg-rose-400/10",
  },
  warning: {
    icon: AlertTriangle,
    dot: "bg-amber-400",
    iconClass: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  info: {
    icon: Info,
    dot: "bg-blue-400",
    iconClass: "text-blue-400",
    bg: "bg-blue-400/10",
  },
};

/* ── HEADER ─────────────────────────────────────────────── */
interface DashboardHeaderProps {
  sidebarOpen?: boolean;
  onSidebarToggle: () => void;
}

export default function DashboardHeader({ onSidebarToggle }: DashboardHeaderProps) {
  const { theme, toggleTheme } = useUIStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // CMD+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setQuickActionsOpen(false);
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 100);
  }, [searchOpen]);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-[--erp-border] bg-[--erp-bg-primary]/90 px-4 backdrop-blur-xl md:px-6">
        {/* Sidebar Toggle */}
        <button
          onClick={onSidebarToggle}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/8 hover:text-white/90 transition-colors"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </button>

        {/* Search Bar */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex flex-1 max-w-sm items-center gap-2 rounded-xl border border-[--erp-border] bg-white/[0.04] px-3.5 py-2 text-sm text-white/40 hover:bg-white/[0.07] hover:text-white/60 transition-all cursor-text"
        >
          <Search className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="hidden sm:block">Search anything...</span>
          <span className="sm:hidden">Search...</span>
          <div className="ml-auto hidden sm:flex items-center gap-0.5 text-[10px] text-white/25">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </button>

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Quick Actions */}
          <div className="relative">
            <button
              onClick={() => { setQuickActionsOpen(!quickActionsOpen); setNotifOpen(false); setProfileOpen(false); }}
              className="hidden sm:flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-3.5 py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity shadow-lg"
            >
              <Plus className="h-3.5 w-3.5" />
              Quick Actions
            </button>
            <AnimatePresence>
              {quickActionsOpen && (
                <DropdownPanel onClose={() => setQuickActionsOpen(false)} className="right-0 w-52 top-10">
                  <div className="p-2 space-y-0.5">
                    {quickActions.map((a) => (
                      <button
                        key={a.label}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/8 hover:text-white transition-colors"
                      >
                        <a.icon className={cn("h-4 w-4 flex-shrink-0", a.color)} />
                        <span className="flex-1 text-left">{a.label}</span>
                        <span className="text-[10px] text-white/25">{a.shortcut}</span>
                      </button>
                    ))}
                  </div>
                </DropdownPanel>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/8 hover:text-white/90 transition-colors"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-4 w-4 text-amber-300" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-4 w-4 text-indigo-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setQuickActionsOpen(false); setProfileOpen(false); }}
              className="relative flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/8 hover:text-white/90 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-400" />
                </span>
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <DropdownPanel onClose={() => setNotifOpen(false)} className="right-0 w-80 top-10">
                  <div className="p-4 border-b border-[--erp-border] flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                      <p className="text-[11px] text-white/40 mt-0.5">{unreadCount} unread alerts</p>
                    </div>
                    <button className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors">
                      Mark all read
                    </button>
                  </div>
                  <div className="divide-y divide-[--erp-border] max-h-80 overflow-y-auto">
                    {notifications.map((n) => {
                      const styles = notifTypeStyles[n.type as keyof typeof notifTypeStyles];
                      const NIcon = styles.icon;
                      return (
                        <div
                          key={n.id}
                          className={cn(
                            "flex items-start gap-3 px-4 py-3 hover:bg-white/4 transition-colors cursor-pointer",
                            !n.read && "bg-white/[0.02]"
                          )}
                        >
                          <div className={cn("mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg", styles.bg)}>
                            <NIcon className={cn("h-3.5 w-3.5", styles.iconClass)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white/90">{n.title}</p>
                            <p className="text-[11px] text-white/50 mt-0.5 truncate">{n.desc}</p>
                            <p className="text-[10px] text-white/30 mt-1">{n.time}</p>
                          </div>
                          {!n.read && <div className={cn("mt-2 h-1.5 w-1.5 rounded-full flex-shrink-0", styles.dot)} />}
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-3 border-t border-[--erp-border]">
                    <button className="w-full text-center text-xs text-cyan-400 hover:text-cyan-300 transition-colors py-1">
                      View all notifications →
                    </button>
                  </div>
                </DropdownPanel>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-white/10 mx-1 hidden sm:block" />

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); setQuickActionsOpen(false); }}
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-white/8 transition-colors"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
                DA
              </div>
              <div className="hidden md:block text-left">
                <p className="text-[12px] font-semibold text-white/90 leading-tight">David Admin</p>
                <p className="text-[10px] text-white/40 leading-tight">Administrator</p>
              </div>
              <ChevronDown className={cn("h-3 w-3 text-white/30 hidden md:block transition-transform", profileOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <DropdownPanel onClose={() => setProfileOpen(false)} className="right-0 w-48 top-10">
                  <div className="p-3 border-b border-[--erp-border]">
                    <p className="text-sm font-semibold text-white">David Admin</p>
                    <p className="text-[11px] text-white/40 mt-0.5">admin@erpsuite.io</p>
                  </div>
                  <div className="p-2 space-y-0.5">
                    {[
                      { icon: User, label: "My Profile" },
                      { icon: Settings, label: "Settings" },
                      { icon: HelpCircle, label: "Help & Support" },
                    ].map((item) => (
                      <button key={item.label} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/8 hover:text-white transition-colors">
                        <item.icon className="h-3.5 w-3.5" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="p-2 border-t border-[--erp-border]">
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-rose-400 hover:bg-rose-400/10 transition-colors">
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                </DropdownPanel>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── AI SEARCH OVERLAY ─────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-20 z-50 w-full max-w-xl -translate-x-1/2 rounded-2xl border border-[--erp-border] bg-[--erp-bg-elevated] shadow-2xl overflow-hidden"
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-[--erp-border]">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Zap className="h-4 w-4" />
                  <span className="text-xs font-semibold">AI Search</span>
                </div>
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask anything about your business..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-white/30 hover:text-white/70 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="p-3">
                <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  Suggested
                </p>
                <div className="space-y-0.5">
                  {[
                    "Show revenue for last 30 days",
                    "List low stock products",
                    "Overdue invoices summary",
                    "Top 5 customers by revenue",
                    "Forecast inventory for next month",
                  ].map((s) => (
                    <button
                      key={s}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:bg-white/6 hover:text-white/90 transition-colors text-left"
                    >
                      <Search className="h-3.5 w-3.5 flex-shrink-0 text-white/30" />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-4 py-2.5 border-t border-[--erp-border] flex items-center gap-4 text-[10px] text-white/25">
                <span><kbd className="font-mono">↵</kbd> to search</span>
                <span><kbd className="font-mono">Esc</kbd> to close</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── SHARED DROPDOWN PANEL ───────────────────────────────── */
function DropdownPanel({
  children,
  onClose,
  className,
}: {
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={cn(
        "absolute z-30 rounded-2xl border border-[--erp-border] bg-[--erp-bg-elevated] shadow-2xl overflow-hidden",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
