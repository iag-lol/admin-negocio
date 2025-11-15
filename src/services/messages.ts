import { getSupabaseClient } from "@/lib/supabaseClients";
import type { AdminMessage, StoreId } from "@/types";

const TABLE = "admin_messages";

export async function fetchMessages(storeId: StoreId, employeeId?: string) {
  const client = getSupabaseClient(storeId);
  let query = client.from<AdminMessage>(TABLE).select("*").order("created_at", { ascending: false });

  query = query.or(
    employeeId
      ? `store_id.eq.${storeId},store_id.is.null,receiver_id.eq.${employeeId}`
      : `store_id.eq.${storeId},store_id.is.null`,
  );

  const { data, error } = await query.limit(50);
  if (error) {
    console.error("messages.fetch", error);
    throw error;
  }
  return data ?? [];
}

export interface CreateMessageInput {
  title: string;
  body: string;
  store_id: StoreId | null;
  sender_id: string;
  receiver_id?: string | null;
}

export async function createMessage(storeId: StoreId, payload: CreateMessageInput) {
  const client = getSupabaseClient(storeId);
  const { data, error } = await client.from(TABLE).insert(payload).select("*").single();
  if (error) {
    throw error;
  }
  return data as AdminMessage;
}

export async function markMessageRead(storeId: StoreId, messageId: string, employeeId: string) {
  const client = getSupabaseClient(storeId);
  const { data, error } = await client.rpc("append_read_by", { message_id: messageId, employee_id: employeeId });
  if (error) {
    console.error("messages.markRead", error);
    throw error;
  }
  return data;
}
