import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LogisticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Logística y compras</h1>
        <p className="text-sm text-muted-foreground">Seguimiento de pedidos y listas de compra.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lista de compra</CardTitle>
            <CardDescription>Genera pedidos críticos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border p-3 text-sm">
              No hay pedidos generados. Usa la vista de stock para pre-cargar cantidades y expórtalas aquí.
            </div>
            <Button>Crear pedido</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Proveedores</CardTitle>
            <CardDescription>Estado de abastecimiento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Panadería Santa Elena — Pedido entregado</p>
            <p>Bebidas Frías Express — Caminando</p>
            <p>Lácteos del Sur — Falta confirmación</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
