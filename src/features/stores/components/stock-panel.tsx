"use client";

import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleTable } from "@/components/data/simple-table";
import { fetchProducts, calculateLowStock, calculateNearCritical, buildPurchaseProjection } from "@/services/products";
import type { StoreId } from "@/types";
import { Button } from "@/components/ui/button";

export function StockPanel({ storeId }: { storeId: StoreId }) {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", storeId],
    queryFn: () => fetchProducts(storeId),
  });

  const lowStock = calculateLowStock(products);
  const nearCritical = calculateNearCritical(products);
  const projections = buildPurchaseProjection(products);

  const exportCsv = () => {
    const rows = [
      ["Producto", "Stock", "Min", "Objetivo", "Comprar"],
      ...projections.map((p) => [p.productName, p.stock, p.minStock, p.targetStock, p.suggestedPurchase]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lista-compra-${storeId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Tabs defaultValue="general">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="low">Bajo stock</TabsTrigger>
        <TabsTrigger value="near">Próximos críticos</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>Inventario</CardTitle>
            <CardDescription>Todos los productos</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable
              data={products}
              columns={[
                { key: "name", label: "Producto" },
                { key: "stock", label: "Stock" },
                { key: "stock_min", label: "Stock min" },
                { key: "category", label: "Categoría" },
              ]}
              emptyMessage={isLoading ? "Cargando..." : "Sin productos"}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="low">
        <Card>
          <CardHeader>
            <CardTitle>Bajo stock</CardTitle>
            <CardDescription>Productos críticos</CardDescription>
          </CardHeader>
          <CardContent>
            <SimpleTable data={lowStock} columns={[{ key: "name", label: "Producto" }, { key: "stock", label: "Stock" }, { key: "stock_min", label: "Min" }]} emptyMessage="Sin alertas" />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="near">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Próximos críticos</CardTitle>
              <CardDescription>Planea compras anticipadas</CardDescription>
            </div>
            <Button size="sm" onClick={exportCsv}>
              Exportar CSV
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <SimpleTable
              data={nearCritical}
              columns={[
                { key: "name", label: "Producto" },
                { key: "stock", label: "Stock" },
                { key: "stock_min", label: "Stock min" },
              ]}
              emptyMessage="Sin productos próximos a crítico"
            />
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">Proyección de compra sugerida</p>
              <SimpleTable
                data={projections}
                columns={[
                  { key: "productName", label: "Producto" },
                  { key: "stock", label: "Stock" },
                  { key: "minStock", label: "Min" },
                  { key: "targetStock", label: "Objetivo" },
                  { key: "suggestedPurchase", label: "Comprar" },
                ]}
                emptyMessage="Sin datos"
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
