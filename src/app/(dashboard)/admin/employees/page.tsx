import { EmployeesTable } from "@/features/hr/components/employees-table";
import { readSession } from "@/lib/auth";
import { STORE_IDS } from "@/types";
import { ensureStoreId } from "@/lib/store";

export default async function EmployeesPage() {
  const session = await readSession();
  const storeId = ensureStoreId(session?.store_id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">RRHH y Personal</h1>
        <p className="text-sm text-muted-foreground">Gestiona altas, bajas y reset de contraseñas.</p>
      </div>
      <EmployeesTable storeId={storeId} />
      <p className="text-xs text-muted-foreground">
        Cambia de local seleccionando otro en los accesos laterales. Se soportan: {STORE_IDS.join(", ")}.
      </p>
    </div>
  );
}
