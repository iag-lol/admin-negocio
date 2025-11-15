import { notFound } from "next/navigation";
import { StockPanel } from "@/features/stores/components/stock-panel";
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
    </div>
  );
}
