"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Sidebar context
interface SidebarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextType>({
  open: true,
  setOpen: () => {},
});

interface SidebarProviderProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function SidebarProvider({
  children,
  open: controlledOpen,
  onOpenChange,
}: SidebarProviderProps) {
  const [internalOpen, setInternalOpen] = React.useState(true);
  const open = controlledOpen ?? internalOpen;
  const setOpen = (val: boolean) => {
    setInternalOpen(val);
    onOpenChange?.(val);
  };

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

function useSidebar() {
  return React.useContext(SidebarContext);
}

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-64 flex-col border-r border-white/10 bg-[#08131f]",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2 p-4", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-1 flex-col overflow-auto p-2", className)}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2 p-4", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("group/menu-item relative", className)}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  asChild?: boolean;
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, isActive, asChild: _asChild, children, ...props }, ref) => (
  <button
    ref={ref}
    data-active={isActive}
    className={cn(
      "flex w-full items-center gap-2 overflow-hidden rounded-lg px-3 py-2 text-left text-sm font-medium text-white/70 outline-none ring-sidebar-ring transition-all hover:bg-white/5 hover:text-white focus-visible:ring-2 active:bg-white/10 disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-cyan-400/10 data-[active=true]:text-cyan-300",
      className
    )}
    {...props}
  >
    {children}
  </button>
));
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
    {...props}
  />
));
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-white/40 outline-none ring-sidebar-ring transition-all focus-visible:ring-2",
      className
    )}
    {...props}
  />
));
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("w-full text-sm", className)} {...props} />
));
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mx-2 my-1 h-px bg-white/10", className)}
    {...props}
  />
));
SidebarSeparator.displayName = "SidebarSeparator";

export {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
  useSidebar,
};
