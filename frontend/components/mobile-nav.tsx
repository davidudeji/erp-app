"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  CreditCard,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Sales", href: "/dashboard/sales-orders", icon: ShoppingCart },
  { label: "Inventory", href: "/dashboard/products", icon: Package },
  { label: "Finance", href: "/dashboard/invoices", icon: CreditCard },
  { label: "More", href: "/dashboard/settings", icon: MoreHorizontal },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-stretch border-t border-[--erp-border] bg-[--erp-bg-secondary]/95 backdrop-blur-xl md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition-colors",
              isActive ? "text-cyan-400" : "text-white/40 hover:text-white/70"
            )}
          >
            <div className="relative">
              <Icon className="h-5 w-5" />
              {isActive && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-cyan-400" />
              )}
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
