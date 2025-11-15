import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DashboardData } from "@/features/dashboard/hooks/useDashboardData";

interface AlertsPanelProps {
  alerts: DashboardData["alerts"];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas operativas</CardTitle>
        <CardDescription>Stock, turnos y RRHH en tiempo real</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 && <p className="text-sm text-muted-foreground">Sin alertas activas</p>}
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <p className="font-medium">{alert.title}</p>
              <Badge variant={alert.severity === "critical" ? "destructive" : alert.severity === "warning" ? "secondary" : "outline"}>{alert.severity}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{alert.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
