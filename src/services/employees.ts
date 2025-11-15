import { getSupabaseClient } from "@/lib/supabaseClients";
import type { Employee, StoreId } from "@/types";

const TABLE = "employees";

export async function fetchEmployees(storeId: StoreId | "multi" = "elroble") {
  const client = getSupabaseClient(typeof storeId === "string" && storeId !== "multi" ? storeId : "elroble");
  const { data, error } = await client
    .from(TABLE)
    .select("*")
    .order("full_name", { ascending: true });

  if (error) {
    console.error("employees.fetch", error);
    throw error;
  }

  return (data ?? []) as Employee[];
}

export interface CreateEmployeeInput {
  rut: string;
  full_name: string;
  role: Employee["role"];
  store_id: Employee["store_id"];
  contract_type: Employee["contract_type"];
  base_salary: number;
  hourly_rate?: number | null;
  password_hash: string;
}

export async function createEmployee(storeId: StoreId, payload: CreateEmployeeInput) {
  const client = getSupabaseClient(storeId);
  const { data, error } = await client.from(TABLE).insert(payload).select("*").single();
  if (error) {
    console.error("employees.create", error);
    throw error;
  }
  return data as Employee;
}

export async function toggleEmployeeActive(storeId: StoreId, employeeId: string, isActive: boolean) {
  const client = getSupabaseClient(storeId);
  const { data, error } = await client
    .from(TABLE)
    .update({ is_active: isActive })
    .eq("id", employeeId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }
  return data as Employee;
}
