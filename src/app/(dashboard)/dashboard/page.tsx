"use client";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";
import { StoreGrid } from "@/features/dashboard/components/store-grid";
import { AlertsPanel } from "@/features/dashboard/components/alerts-panel";
import { LowStockWidget } from "@/features/dashboard/components/low-stock-widget";
import type { DashboardKpi } from "@/types";

const KPI_CONFIG: DashboardKpi[] = [
  { id: "sales", label: "Ventas del día", value: "$0", trend: "+0%", status: "neutral" },
  { id: "openShifts", label: "Turnos abiertos", value: "0", status: "neutral" },
  { id: "lowStock", label: "Bajo stock", value: "0 productos", status: "neutral" },
  { id: "attendance", label: "Asistencia", value: "0%", trend: "0%" },
];

export default function DashboardPage() {
  const { data, isLoading } = useDashboardData();

  const computedKpis: DashboardKpi[] =
    data && data.summaries
      ? [
        {
          id: "sales",
          label: "Ventas consolidadas",
          value: `$${data.summaries.reduce((acc, store) => acc + store.salesToday, 0).toLocaleString("es-CL")}`,
          status: "positive",
          trend: "+5%",
        },
        {
          id: "openShifts",
          label: "Turnos abiertos",
          value: String(data.summaries.reduce((acc, store) => acc + store.openShifts, 0)),
          status: "neutral",
        },
        {
          id: "lowStock",
          label: "Productos críticos",
          value: `${data.lowStockGlobal.length} productos`,
          status: data.lowStockGlobal.length > 0 ? "negative" : "positive",
        },
        {
          id: "attendance",
          label: "Asistencia promedio",
          value: `${Math.round(
            data.summaries.reduce((acc, store) => acc + store.attendanceRate, 0) / data.summaries.length,
          )}%`,
          trend: "-1%",
        },
      ]
      : KPI_CONFIG;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Dashboard general</h1>
        <p className="text-sm text-muted-foreground">Consolidado de RRHH, operaciones y stock</p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Obteniendo información desde Supabase…
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {computedKpis.map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} />
            ))}
          </div>

          <StoreGrid summaries={data?.summaries ?? []} />

          <div className="grid gap-4 lg:grid-cols-2">
            <AlertsPanel alerts={data?.alerts ?? []} />
            <LowStockWidget items={data?.lowStockGlobal ?? []} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Checklist diario</CardTitle>
              <CardDescription>Prioriza tus próximas acciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-lg border p-3">
                <p className="font-medium">Revisar cierres</p>
                <p className="text-muted-foreground">Valida diferencias de caja y envía reporte antes de las 13:00.</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="font-medium">Plan de compra</p>
                <p className="text-muted-foreground">Confirma pedidos críticos para Maipú y El Roble.</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="font-medium">Asistencia</p>
                <p className="text-muted-foreground">Hay 2 atrasos registrados. Coordina reemplazo.</p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
