import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const purchaseList = [
  { product: "Harina integral", qty: 50, provider: "Molinos Yungay", status: "pendiente" },
  { product: "Leche entera", qty: 40, provider: "Lácteos del Sur", status: "confirmado" },
  { product: "Envases eco", qty: 200, provider: "EcoPack", status: "en camino" },
];

const deliveries = [
  { provider: "Panadería Santa Elena", eta: "Mañana 08:00", store: "elroble", status: "Programado" },
  { provider: "Bebidas Express", eta: "Hoy 18:00", store: "maipu", status: "En ruta" },
  { provider: "Frutas Fresh", eta: "Pendiente", store: "maipu", status: "Por confirmar" },
];

export default function LogisticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Logística y compras</h1>
        <p className="text-sm text-muted-foreground">Seguimiento de pedidos y listas de compra.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lista de compra</CardTitle>
            <CardDescription>Prioriza los insumos con quiebre</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead className="text-right">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseList.map((item) => (
                    <TableRow key={item.product}>
                      <TableCell className="font-medium">
                        {item.product} <span className="text-muted-foreground">({item.qty})</span>
                      </TableCell>
                      <TableCell>{item.provider}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={item.status === "pendiente" ? "outline" : item.status === "en camino" ? "secondary" : "secondary"}>{item.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Button>Crear pedido</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Entregas programadas</CardTitle>
            <CardDescription>Estado de abastecimiento por proveedor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {deliveries.map((delivery) => (
              <div key={delivery.provider} className="rounded-lg border p-3">
                <div className="flex items-center justify-between font-medium">
                  <span>{delivery.provider}</span>
                  <Badge variant={delivery.status === "En ruta" ? "secondary" : "outline"}>{delivery.status}</Badge>
                </div>
                <p className="text-muted-foreground">
                  {delivery.store} · ETA {delivery.eta}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
