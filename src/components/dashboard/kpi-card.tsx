import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DashboardKpi } from "@/types";

interface Props {
  kpi: DashboardKpi;
}

export function KpiCard({ kpi }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardDescription>{kpi.label}</CardDescription>
          <CardTitle className="text-2xl font-semibold">{kpi.value}</CardTitle>
        </div>
        {kpi.status && (
          <Badge variant={kpi.status === "positive" ? "secondary" : kpi.status === "negative" ? "destructive" : "outline"}>
            {kpi.trend ?? kpi.status}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {kpi.trend ? `Variación: ${kpi.trend}` : "Sin variación"}
      </CardContent>
    </Card>
  );
}
