"use client";

import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui-store";
import { useNotificationsStore } from "@/store/notifications-store";
import { NotificationPanel } from "@/components/notifications/notification-panel";
import { useState } from "react";

export function DashboardHeader() {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const unreadCount = useNotificationsStore((state) => state.items.filter((item) => !item.read).length);
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-2 lg:hidden">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <span className="text-sm font-semibold">Panel</span>
      </div>
      <div className="hidden lg:flex items-center gap-3 text-sm text-muted-foreground">
        <span>Panel General</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setPanelOpen((prev) => !prev)} className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
          )}
        </Button>
      </div>
      {panelOpen && <NotificationPanel onClose={() => setPanelOpen(false)} />}
    </header>
  );
}
