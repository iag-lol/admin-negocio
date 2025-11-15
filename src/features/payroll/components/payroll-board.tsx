"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPayroll } from "@/services/payroll";
import type { StoreId } from "@/types";
import { SimpleTable } from "@/components/data/simple-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PayrollBoard({ storeId }: { storeId: StoreId }) {
  const { data: payroll = [], isLoading } = useQuery({ queryKey: ["payroll", storeId], queryFn: () => fetchPayroll(storeId) });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Liquidaciones</CardTitle>
          <CardDescription>Historial por período</CardDescription>
        </div>
        <Button size="sm">Generar período</Button>
      </CardHeader>
      <CardContent>
        <SimpleTable
          data={payroll}
          columns={[
            { key: "period", label: "Período" },
            { key: "employee_id", label: "Empleado" },
            { key: "gross_salary", label: "Bruto", render: (row) => `$${row.gross_salary.toLocaleString()}` },
            { key: "net_salary", label: "Neto", render: (row) => `$${row.net_salary.toLocaleString()}` },
            {
              key: "status",
              label: "Estado",
              render: (row) => <Badge variant={row.status === "pagado" ? "secondary" : "outline"}>{row.status}</Badge>,
            },
          ]}
          emptyMessage={isLoading ? "Cargando..." : "Sin liquidaciones"}
        />
      </CardContent>
    </Card>
  );
}
