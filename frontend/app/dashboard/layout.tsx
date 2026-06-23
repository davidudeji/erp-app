"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import DashboardSidebar from "@/components/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardHeader from "@/components/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-full min-h-screen flex-col bg-[#061018] text-white">
      {/* Mobile Menu Button - Always Visible */}
      <div className="md:hidden fixed top-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg border border-white/10 bg-white/5 p-2 hover:bg-white/10 transition"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {(sidebarOpen || mobileMenuOpen) && (
            <motion.aside
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed md:static md:w-64 w-64 h-full md:h-auto flex-shrink-0 z-30 md:z-auto"
              onClick={() => setMobileMenuOpen(false)}
            >
              <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <DashboardSidebar />
              </SidebarProvider>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Header */}
          <DashboardHeader
            sidebarOpen={sidebarOpen}
            onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="h-full">{children}</div>
          </main>
        </div>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-20 bg-black/50 md:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
