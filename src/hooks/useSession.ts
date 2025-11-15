"use client";

import { useEffect } from "react";
import { useSessionStore } from "@/store/session-store";

export function useSession() {
  const { setSession, clearSession, setLoading, ...state } = useSessionStore();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          clearSession();
          return;
        }
        const data = await response.json();
        if (!mounted) return;
        setSession({
          employeeId: data.employee.id,
          role: data.employee.role,
          storeId: data.employee.store_id,
          fullName: data.employee.full_name,
        });
      } catch (error) {
        console.error(error);
        clearSession();
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [setSession, clearSession, setLoading]);

  return state;
}
