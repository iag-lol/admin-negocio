import { EmployeesTable } from "@/features/hr/components/employees-table";
import { readSession } from "@/lib/auth";
import { STORE_IDS } from "@/types";
import { ensureStoreId } from "@/lib/store";
import { fetchEmployees } from "@/services/employees";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function EmployeesPage() {
  const session = await readSession();
  const storeId = ensureStoreId(session?.store_id);
  const employees = await fetchEmployees(storeId);
  const active = employees.filter((employee) => employee.is_active).length;
  const inactive = employees.length - active;
  const multiStore = employees.filter((employee) => employee.store_id === "multi").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">RRHH y Personal</h1>
        <p className="text-sm text-muted-foreground">Gestiona altas, bajas y reset de contraseñas.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Activos</CardTitle>
            <CardDescription>Colaboradores disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Con licencia/baja</CardTitle>
            <CardDescription>Gestión pendiente</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{inactive}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Equipo multi-local</CardTitle>
            <CardDescription>Personal compartido entre locales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-semibold">{multiStore}</p>
              <Badge variant="secondary">Multi</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      <EmployeesTable storeId={storeId} />
      <p className="text-xs text-muted-foreground">
        Cambia de local seleccionando otro en los accesos laterales. Se soportan: {STORE_IDS.join(", ")}.
      </p>
    </div>
  );
}
