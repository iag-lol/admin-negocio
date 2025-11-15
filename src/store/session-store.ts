import { create } from "zustand";
import type { EmployeeRole, StoreId } from "@/types";

export interface SessionState {
  employeeId: string | null;
  role: EmployeeRole | null;
  storeId: StoreId | null;
  fullName: string | null;
  isLoading: boolean;
  setSession: (payload: {
    employeeId: string;
    role: EmployeeRole;
    storeId: StoreId;
    fullName: string;
  }) => void;
  clearSession: () => void;
  setLoading: (value: boolean) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  employeeId: null,
  role: null,
  storeId: null,
  fullName: null,
  isLoading: true,
  setSession: ({ employeeId, role, storeId, fullName }) =>
    set({ employeeId, role, storeId, fullName, isLoading: false }),
  clearSession: () => set({ employeeId: null, role: null, storeId: null, fullName: null }),
  setLoading: (value) => set({ isLoading: value }),
}));
