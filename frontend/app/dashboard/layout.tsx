"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DashboardSidebar from "@/components/dashboard-sidebar";
import DashboardHeader from "@/components/dashboard-header";
import MobileNav from "@/components/mobile-nav";
import { useUIStore } from "@/store/ui-store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[--erp-bg-primary] text-white dark">
      {/* ── SIDEBAR (Desktop) ───────────────────────────── */}
      <div className="hidden md:flex flex-shrink-0">
        <DashboardSidebar />
      </div>

      {/* ── SIDEBAR (Mobile overlay) ─────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-full md:hidden"
            >
              <DashboardSidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN AREA ────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          onSidebarToggle={toggleSidebar}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV ────────────────────────────── */}
      <MobileNav />
    </div>
  );
}
