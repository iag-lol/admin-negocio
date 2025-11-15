import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DashboardData } from "@/features/dashboard/hooks/useDashboardData";
import { STORE_LABELS } from "@/types";

interface LowStockWidgetProps {
  items: DashboardData["lowStockGlobal"];
}

export function LowStockWidget({ items }: LowStockWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bajo stock consolidado</CardTitle>
        <CardDescription>Sincronizado desde Supabase</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Local</TableHead>
                <TableHead className="text-right">Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                    Sin alertas
                  </TableCell>
                </TableRow>
              )}
              {items.map((entry) => (
                <TableRow key={`${entry.storeId}-${entry.product.id}`}>
                  <TableCell className="font-medium">{entry.product.name}</TableCell>
                  <TableCell>{STORE_LABELS[entry.storeId]}</TableCell>
                  <TableCell className="text-right text-destructive">{entry.product.stock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
