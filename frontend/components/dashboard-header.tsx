"use client";

import { PanelLeft, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export default function DashboardHeader({
  sidebarOpen: _sidebarOpen,
  onSidebarToggle,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b border-white/10 bg-[#061018]/80 px-4 backdrop-blur-xl md:px-6">
      {/* Sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onSidebarToggle}
        className="hidden text-white/60 hover:text-white md:flex"
        aria-label="Toggle sidebar"
      >
        <PanelLeft className="h-5 w-5" />
      </Button>

      {/* Search */}
      <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/40 max-w-sm">
        <Search className="h-4 w-4" />
        <span>Search...</span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-white/60 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400" />
        </Button>

        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400/20 border border-cyan-400/30 text-sm font-semibold text-cyan-300">
          A
        </div>
      </div>
    </header>
  );
}
