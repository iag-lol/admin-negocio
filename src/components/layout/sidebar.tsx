"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV } from "@/lib/constants";
import { LucideIcon, LayoutDashboard, Store, Users, Wallet, Truck, Mail, User } from "lucide-react";
import { useUiStore } from "@/store/ui-store";

const ICONS: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  store: Store,
  users: Users,
  wallet: Wallet,
  truck: Truck,
  mail: Mail,
  user: User,
};

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useUiStore();

  return (
    <aside
      className={cn(
        "bg-sidebar border-r border-sidebar-border flex-col gap-6 p-4 lg:w-64 w-64 fixed inset-y-0 z-40 transition-transform", 
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      <div className="text-xl font-semibold tracking-tight">Negocios MultiLocal</div>
      <nav className="flex flex-col gap-1 text-sm">
        {DASHBOARD_NAV.map((item) => {
          if (item.children) {
            return (
              <div key={item.label} className="mt-2">
                <div className="text-xs uppercase text-muted-foreground mb-1">{item.label}</div>
                <div className="space-y-0.5">
                  {item.children.map((child) => (
                    <SidebarLink key={child.href} href={child.href} label={child.label} isActive={pathname.startsWith(child.href)} onClick={closeSidebar} />
                  ))}
                </div>
              </div>
            );
          }

          return (
            <SidebarLink
              key={item.href}
              href={item.href!}
              label={item.label}
              icon={item.icon}
              isActive={pathname === item.href}
              onClick={closeSidebar}
            />
          );
        })}
      </nav>
    </aside>
  );
}

interface SidebarLinkProps {
  href: string;
  label: string;
  icon?: string;
  isActive: boolean;
  onClick?: () => void;
}

function SidebarLink({ href, label, icon, isActive, onClick }: SidebarLinkProps) {
  const Icon = icon ? ICONS[icon] ?? LayoutDashboard : LayoutDashboard;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 transition-colors",
        isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted",
      )}
    >
      {icon && <Icon className="h-4 w-4" />}
      <span>{label}</span>
    </Link>
  );
}
