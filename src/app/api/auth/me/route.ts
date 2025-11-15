import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabaseClients";
import { ensureStoreId } from "@/lib/store";
import type { Employee } from "@/types";

interface EmployeeRow extends Employee {
  password_hash?: string;
}

export async function GET() {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ message: "Sin sesión" }, { status: 401 });
  }

  const storeId = ensureStoreId(session.store_id);
  let client: ReturnType<typeof getSupabaseClient>;
  try {
    client = getSupabaseClient(storeId);
  } catch (error) {
    return NextResponse.json({ message: "Configura Supabase", detail: String(error) }, { status: 500 });
  }
  const { data, error } = await client
    .from<EmployeeRow>("employees")
    .select("id, full_name, role, store_id, rut")
    .eq("id", session.employee_id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ message: "Error consultando empleado", detail: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ message: "Empleado no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ employee: data });
}
