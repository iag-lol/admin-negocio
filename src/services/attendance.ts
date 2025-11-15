import { getSupabaseClient } from "@/lib/supabaseClients";
import type { AttendanceRecord, StoreId } from "@/types";

const TABLE = "attendance";

export async function fetchAttendance(storeId: StoreId, date?: string) {
  const client = getSupabaseClient(storeId);
  let query = client.from(TABLE).select("*").order("date", { ascending: false });
  if (date) {
    query = query.eq("date", date);
  }
  const { data, error } = await query.limit(100);
  if (error) {
    console.error("attendance.fetch", error);
    throw error;
  }
  return (data ?? []) as AttendanceRecord[];
}

export async function recordAttendance(storeId: StoreId, payload: Partial<AttendanceRecord>) {
  const client = getSupabaseClient(storeId);
  const { data, error } = await client.from(TABLE).insert(payload).select("*").single();
  if (error) throw error;
  return data as AttendanceRecord;
}
