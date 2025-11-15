"use client";

import { ReactNode, useEffect } from "react";
import { useSessionStore } from "@/store/session-store";
import type { SessionPayload } from "@/lib/session-token";
import { ensureStoreId } from "@/lib/store";
import type { EmployeeRole } from "@/types";

interface Props {
  session: (SessionPayload & { fullName?: string }) | null;
  children: ReactNode;
}

export function SessionHydrator({ session, children }: Props) {
  const setSession = useSessionStore((state) => state.setSession);
  const clearSession = useSessionStore((state) => state.clearSession);
  const setLoading = useSessionStore((state) => state.setLoading);

  useEffect(() => {
    if (session) {
      const storeId = ensureStoreId(session.store_id);
      const role = (session.role as EmployeeRole) || "supervisor";
      setSession({
        employeeId: session.employee_id,
        storeId,
        role,
        fullName: session.fullName ?? "Colaborador",
      });
    } else {
      clearSession();
    }
    setLoading(false);
  }, [session, setSession, clearSession, setLoading]);

  return <>{children}</>;
}
