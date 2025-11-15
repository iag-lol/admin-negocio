import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { DashboardHeader } from "@/components/layout/dashboard-header";

interface Props {
  children: ReactNode;
}

export function DashboardShell({ children }: Props) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-4 pb-20 lg:pb-10">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
