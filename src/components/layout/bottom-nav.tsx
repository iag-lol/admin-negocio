"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Clock, Boxes, Mail, User } from "lucide-react";

const ICONS = {
  "layout-dashboard": LayoutDashboard,
  clock: Clock,
  boxes: Boxes,
  mail: Mail,
  user: User,
};

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur border-t border-border lg:hidden">
      <div className="flex items-center justify-around py-2 text-xs">
        {BOTTOM_NAV_LINKS.map((item) => {
          const Icon = ICONS[item.icon as keyof typeof ICONS] ?? LayoutDashboard;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={cn("flex flex-col items-center gap-1", isActive ? "text-primary" : "text-muted-foreground")}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
