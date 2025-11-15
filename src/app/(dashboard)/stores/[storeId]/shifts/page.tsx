import { notFound } from "next/navigation";
import { ShiftBoard } from "@/features/stores/components/shift-board";
import { STORE_IDS, type StoreId } from "@/types";

interface Props {
  params: { storeId: string };
}

export default async function StoreShiftsPage({ params }: Props) {
  const storeId = params.storeId as StoreId;
  if (!STORE_IDS.includes(storeId)) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Turnos {storeId}</h1>
        <p className="text-sm text-muted-foreground">Abrir, cerrar y revisar historial</p>
      </div>
      <ShiftBoard storeId={storeId} />
    </div>
  );
}
