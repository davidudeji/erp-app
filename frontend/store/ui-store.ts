import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light";

interface UIStore {
  sidebarCollapsed: boolean;
  theme: Theme;
  activeSection: string;
  setSidebarCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setActiveSection: (s: string) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      theme: "dark",
      activeSection: "dashboard",
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      toggleSidebar: () =>
        set({ sidebarCollapsed: !get().sidebarCollapsed }),
      setTheme: (t) => {
        set({ theme: t });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", t === "dark");
        }
      },
      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        get().setTheme(next);
      },
      setActiveSection: (s) => set({ activeSection: s }),
    }),
    {
      name: "erp-ui-store",
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== "undefined") {
          document.documentElement.classList.toggle(
            "dark",
            state.theme === "dark"
          );
        }
      },
    }
  )
);
