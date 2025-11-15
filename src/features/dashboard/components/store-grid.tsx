import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import type { StoreSummary } from "@/features/dashboard/hooks/useDashboardData";
import { STORE_LABELS } from "@/types";

interface StoreGridProps {
  summaries: StoreSummary[];
}

export function StoreGrid({ summaries }: StoreGridProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {summaries.map((summary) => (
        <Card key={summary.storeId} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardDescription>{STORE_LABELS[summary.storeId]}</CardDescription>
              <CardTitle className="text-xl">${summary.salesToday.toLocaleString("es-CL")}</CardTitle>
            </div>
            <Badge variant={summary.openShifts > 0 ? "secondary" : "outline"}>{summary.openShifts} turnos abiertos</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Asistencia</p>
              <div className="flex items-center gap-2">
                <Progress value={summary.attendanceRate} className="h-2" />
                <span className="text-sm font-medium">{summary.attendanceRate}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Personal</span>
              <span>{summary.headcount} colaboradores</span>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase text-muted-foreground">Productos críticos</p>
              {summary.lowStock.length === 0 && <p className="text-sm">Sin alertas</p>}
              {summary.lowStock.map((product) => (
                <div key={product.id} className="flex items-center justify-between text-sm">
                  <span>{product.name}</span>
                  <span className="text-destructive">{product.stock}</span>
                </div>
              ))}
            </div>
            <Link href={`/stores/${summary.storeId}/shifts`} className="text-sm font-medium text-primary underline">
              Ver detalle del local
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
