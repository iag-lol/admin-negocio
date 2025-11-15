import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { STORE_LABELS, type DashboardKpi } from "@/types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const KPIS: DashboardKpi[] = [
  { id: "sales", label: "Ventas del día", value: "$2.4M", trend: "+6%", status: "positive" },
  { id: "openShifts", label: "Turnos abiertos", value: "3", status: "neutral" },
  { id: "lowStock", label: "Bajo stock", value: "18 productos", status: "negative" },
  { id: "attendance", label: "Asistencia", value: "92%", trend: "-2%" },
];

const ALERTS = [
  { title: "Caja sin cerrar", detail: "Turno noche Maipú", severity: "high" },
  { title: "Compras pendientes", detail: "Proveedor Lácteos", severity: "medium" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard general</h1>
        <p className="text-sm text-muted-foreground">Resumen operativo de los tres locales</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alertas</CardTitle>
            <CardDescription>Turnos, stock y RRHH</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ALERTS.map((alert) => (
              <div key={alert.title} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{alert.title}</p>
                  <Badge variant={alert.severity === "high" ? "destructive" : "secondary"}>{alert.severity}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{alert.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Locales</CardTitle>
            <CardDescription>Accesos rápidos</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {Object.entries(STORE_LABELS).map(([storeId, label]) => (
              <Link key={storeId} href={`/stores/${storeId}/shifts`} className="rounded-xl border p-4 hover:border-primary">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-base font-semibold">Ver turnos y stock</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
