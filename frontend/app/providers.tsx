"use client";

import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, retry: 1 },
        },
      })
  );

  // Apply dark class on mount (before hydration)
  useEffect(() => {
    const stored = localStorage.getItem("erp-ui-store");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const theme = parsed?.state?.theme ?? "dark";
        document.documentElement.classList.toggle("dark", theme === "dark");
      } catch {
        document.documentElement.classList.add("dark");
      }
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <TooltipProvider>
          {children}
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
