import { NextResponse } from "next/server";
import { readSession, hashPassword } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabaseClients";
import { ensureStoreId } from "@/lib/store";

export async function POST(request: Request) {
  const session = await readSession();
  if (!session || !session.role?.startsWith("admin")) {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const targetStore = ensureStoreId(body.store_id ?? session.store_id);
  const passwordHash = await hashPassword(body.password ?? body.full_name);

  let client: ReturnType<typeof getSupabaseClient>;
  try {
    client = getSupabaseClient(targetStore);
  } catch (error) {
    return NextResponse.json({ message: "Configura las credenciales de Supabase", detail: String(error) }, { status: 500 });
  }

  const normalizeNumber = (value: unknown) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const payload = {
    rut: body.rut,
    full_name: body.full_name,
    role: body.role,
    store_id: body.store_id ?? session.store_id,
    contract_type: body.contract_type,
    base_salary: normalizeNumber(body.base_salary) ?? 0,
    hourly_rate: normalizeNumber(body.hourly_rate),
    password_hash: passwordHash,
    is_active: true,
  };

  const { data, error } = await client
    .from("employees")
    .insert(payload)
    .select("id, rut, full_name, role, store_id, contract_type, base_salary, hourly_rate, is_active")
    .single();

  if (error) {
    console.error("api.employees.create", error);
    return NextResponse.json({ message: "No se pudo crear", detail: error.message }, { status: 400 });
  }

  return NextResponse.json({ employee: data });
}
