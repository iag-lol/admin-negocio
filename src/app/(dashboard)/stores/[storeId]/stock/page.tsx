import { notFound } from "next/navigation";
import { StockPanel } from "@/features/stores/components/stock-panel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STORE_IDS, type StoreId } from "@/types";

interface Props {
  params: { storeId: string };
}

export default function StoreStockPage({ params }: Props) {
  const storeId = params.storeId as StoreId;
  if (!STORE_IDS.includes(storeId)) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Stock {storeId}</h1>
        <p className="text-sm text-muted-foreground">Seguimiento de inventario y compras</p>
      </div>
      <StockPanel storeId={storeId} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Plan de compra recomendado</CardTitle>
            <CardDescription>Sincroniza tu pedido semanal con proveedores clave</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between font-medium">
                <span>Lácteos del Sur</span>
                <Badge variant="secondary">Entrega 24h</Badge>
              </div>
              <p className="text-muted-foreground">Comprar 40 lt de leche y 20 kg de mantequilla para reponer antes del viernes.</p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between font-medium">
                <span>Panadería Santa Elena</span>
                <Badge variant="outline">Confirmar</Badge>
              </div>
              <p className="text-muted-foreground">Pedido de 150 unidades de masa lista para el turno mañana.</p>
            </div>
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between font-medium">
                <span>Bebidas Express</span>
                <Badge variant="destructive">Crítico</Badge>
              </div>
              <p className="text-muted-foreground">Stock de bebidas individuales está bajo en Maipú, agenda despacho urgente.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Checklist de bodega</CardTitle>
            <CardDescription>Control rápido para el cierre del turno</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="rounded-md border p-3">
              <p className="font-medium">Temperatura cámaras</p>
              <p className="text-muted-foreground">Verifica que se mantenga entre 2º y 4º.</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="font-medium">Stock crítico etiquetado</p>
              <p className="text-muted-foreground">Asegura que los productos rojos estén señalizados con fecha.</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="font-medium">Orden y limpieza</p>
              <p className="text-muted-foreground">Foto final y registro en mensajes internos.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
