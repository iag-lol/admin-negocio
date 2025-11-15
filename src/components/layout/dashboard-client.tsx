"use client";

import { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useSessionStore } from "@/store/session-store";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

export function DashboardClient({ children }: { children: ReactNode }) {
  const storeId = useSessionStore((state) => state.storeId);
  const employeeId = useSessionStore((state) => state.employeeId);

  useRealtimeNotifications({ storeId: storeId ?? undefined, employeeId: employeeId ?? undefined });

  return <DashboardShell>{children}</DashboardShell>;
}
