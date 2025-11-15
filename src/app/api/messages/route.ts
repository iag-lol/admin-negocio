import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabaseClients";
import { ensureStoreId } from "@/lib/store";

export async function POST(request: Request) {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const storeId = ensureStoreId(session.store_id);
  let client: ReturnType<typeof getSupabaseClient>;
  try {
    client = getSupabaseClient(storeId);
  } catch (error) {
    return NextResponse.json({ message: "Configura Supabase", detail: String(error) }, { status: 500 });
  }

  const payload = {
    title: body.title,
    body: body.body,
    store_id: body.store_id ?? storeId,
    sender_id: session.employee_id,
    receiver_id: body.receiver_id ?? null,
    read_by: [],
  };

  const { data, error } = await client
    .from("admin_messages")
    .insert(payload)
    .select("id, title, body, store_id, sender_id, receiver_id, created_at")
    .single();

  if (error) {
    return NextResponse.json({ message: "Error guardando", detail: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: data });
}
