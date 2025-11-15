import { getSupabaseClient } from "@/lib/supabaseClients";
import type { PayrollRecord, StoreId } from "@/types";

const TABLE = "payroll";

export async function fetchPayroll(storeId: StoreId, period?: string) {
  const client = getSupabaseClient(storeId);
  let query = client.from(TABLE).select("*").order("period", { ascending: false });
  if (period) {
    query = query.eq("period", period);
  }
  const { data, error } = await query.limit(50);
  if (error) {
    console.error("payroll.fetch", error);
    throw error;
  }
  return (data ?? []) as PayrollRecord[];
}

export interface PayrollInput {
  employee_id: string;
  period: string;
  gross_salary: number;
  legal_discounts: Record<string, number>;
  other_discounts: Record<string, number>;
  net_salary: number;
  status: PayrollRecord["status"];
}

export async function createPayroll(storeId: StoreId, payload: PayrollInput) {
  const client = getSupabaseClient(storeId);
  const { data, error } = await client.from(TABLE).insert(payload).select("*").single();
  if (error) {
    throw error;
  }
  return data as PayrollRecord;
}
