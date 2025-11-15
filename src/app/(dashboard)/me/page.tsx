import { readSession } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ensureStoreId } from "@/lib/store";

export default async function MePage() {
  const session = await readSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Mi perfil</h1>
        <p className="text-sm text-muted-foreground">Información del colaborador y accesos rápidos.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{session?.fullName ?? "Colaborador"}</CardTitle>
          <CardDescription>{session?.role}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Local asignado: <Badge variant="secondary">{ensureStoreId(session?.store_id)}</Badge>
          </p>
          <p>ID empleado: {session?.employee_id}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Últimas liquidaciones</CardTitle>
          <CardDescription>Versión resumida</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Próximamente podrás descargar tus liquidaciones desde aquí.
        </CardContent>
      </Card>
    </div>
  );
}
