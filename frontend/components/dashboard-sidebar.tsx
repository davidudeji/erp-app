"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Tags,
  ScrollText,
  Settings,
  Boxes,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const navItems = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Inventory",
    items: [
      { title: "Products", href: "/dashboard/products", icon: Package },
      { title: "Categories", href: "/dashboard/categories", icon: Tags },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Invoices", href: "/dashboard/invoices", icon: FileText },
      { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Audit Logs", href: "/dashboard/audit-logs", icon: ScrollText },
      { title: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 border border-cyan-400/20">
            <Boxes className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">ERP Suite</p>
            <p className="text-xs text-white/40">Enterprise OS</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {navItems.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton isActive={isActive} asChild>
                        <Link href={item.href} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <p className="px-2 text-xs text-white/30">
          ERP Suite v1.0
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
