import { readSession } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ensureStoreId } from "@/lib/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const upcomingShifts = [
  { date: "2024-05-20", type: "Mañana", store: "maipu" },
  { date: "2024-05-22", type: "Tarde", store: "maipu" },
  { date: "2024-05-24", type: "Noche", store: "maipu" },
];

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
          <p>Correo: operaciones@negocio.cl</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Próximos turnos</CardTitle>
          <CardDescription>Consulta tu planificación semanal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Local</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingShifts.map((shift) => (
                  <TableRow key={shift.date}>
                    <TableCell>{shift.date}</TableCell>
                    <TableCell>{shift.type}</TableCell>
                    <TableCell>{shift.store}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
