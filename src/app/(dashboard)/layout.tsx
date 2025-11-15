import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { SessionHydrator } from "@/components/providers/session-hydrator";
import { DashboardClient } from "@/components/layout/dashboard-client";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await readSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <SessionHydrator session={session}>
      <DashboardClient>{children}</DashboardClient>
    </SessionHydrator>
  );
}
