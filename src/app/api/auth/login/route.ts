import { NextResponse } from "next/server";
import { createSession, verifyPassword } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabaseClients";
import { ensureStoreId } from "@/lib/store";
import type { StoreId, Employee } from "@/types";

interface EmployeeRow extends Employee {
  password_hash: string;
}

const STORES: StoreId[] = ["elroble", "maipu", "lareina"];

export async function POST(request: Request) {
  const { rut, password } = await request.json();
  if (!rut || !password) {
    return NextResponse.json({ message: "RUT y contraseña son obligatorios" }, { status: 400 });
  }

  let employee: EmployeeRow | null = null;
  let storeMatched: StoreId = "elroble";

  for (const storeId of STORES) {
    try {
      const client = getSupabaseClient(storeId);
      const { data } = await client
        .from<EmployeeRow>("employees")
        .select("*")
        .eq("rut", rut)
        .eq("is_active", true)
        .maybeSingle();
      if (data) {
        employee = data;
        storeMatched = storeId;
        break;
      }
    } catch (error) {
      console.warn("login.lookup", error);
    }
  }

  if (!employee) {
    return NextResponse.json({ message: "RUT no encontrado" }, { status: 404 });
  }

  const isValid = await verifyPassword(password, employee.password_hash);
  if (!isValid) {
    return NextResponse.json({ message: "Contraseña inválida" }, { status: 401 });
  }

  const sessionStore = ensureStoreId(employee.store_id === "multi" ? storeMatched : employee.store_id ?? storeMatched);

  await createSession({
    employee_id: employee.id,
    role: employee.role,
    store_id: sessionStore,
    fullName: employee.full_name,
  });

  const { password_hash: _passwordHash, ...publicEmployee } = employee;
  void _passwordHash;
  return NextResponse.json({ employee: publicEmployee });
}
