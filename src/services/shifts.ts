import { getSupabaseClient } from "@/lib/supabaseClients";
import type { Shift, StoreId } from "@/types";

export async function fetchOpenShifts(storeId: StoreId) {
  const client = getSupabaseClient(storeId);
  const table = storeId === "maipu" ? "elianamaipu_shifts" : "shifts";
  const { data, error } = await client
    .from<Shift>(table)
    .select("*")
    .eq(storeId === "maipu" ? "status" : "is_open", storeId === "maipu" ? "open" : true)
    .order(storeId === "maipu" ? "created_at" : "opened_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("shifts.fetchOpen", error);
    throw error;
  }

  return data ?? [];
}

export interface CreateShiftInput {
  seller: string;
  type: string;
  cash_initial?: number;
}

export async function createShift(storeId: StoreId, payload: CreateShiftInput) {
  const client = getSupabaseClient(storeId);
  const table = storeId === "maipu" ? "elianamaipu_shifts" : "shifts";
  const insertPayload =
    storeId === "maipu"
      ? {
          seller: payload.seller,
          type: payload.type,
          status: "open",
          start_time: new Date().toISOString(),
          initial_cash: payload.cash_initial ?? null,
        }
      : {
          store_id: storeId,
          seller: payload.seller,
          type: payload.type,
          cash_initial: payload.cash_initial ?? null,
          is_open: true,
          opened_at: new Date().toISOString(),
        };

  const { data, error } = await client.from(table).insert(insertPayload).select("*").single();
  if (error) {
    console.error("shifts.create", error);
    throw error;
  }
  return data as Shift;
}

export async function closeShift(
  storeId: StoreId,
  shiftId: string | number,
  payload: { total_sales: number; cash_sales?: number; cash_counted?: number; difference?: number },
) {
  const client = getSupabaseClient(storeId);
  const table = storeId === "maipu" ? "elianamaipu_shifts" : "shifts";
  const updatePayload =
    storeId === "maipu"
      ? {
          status: "closed",
          end_time: new Date().toISOString(),
          total_sales: payload.total_sales,
          cash_counted: payload.cash_counted ?? null,
          difference: payload.difference ?? null,
        }
      : {
          is_open: false,
          closed_at: new Date().toISOString(),
          total_sales: payload.total_sales,
          cash_sales: payload.cash_sales ?? null,
        };

  const { data, error } = await client
    .from(table)
    .update(updatePayload)
    .eq("id", shiftId)
    .select("*")
    .single();

  if (error) {
    console.error("shifts.close", error);
    throw error;
  }

  return data as Shift;
}
