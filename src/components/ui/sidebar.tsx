
import React from "react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/useMobile";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Sidebar({ className, children, ...props }: SidebarProps) {
  const isMobile = useMobile();
  
  return (
    <aside
      className={cn(
        "w-64 border-r border-border bg-background p-4",
        isMobile ? "fixed inset-y-0 z-50 -translate-x-full transition-all" : "h-screen",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

export default Sidebar;
