import { STORE_IDS, type StoreId } from "@/types";
import { notFound } from "next/navigation";

interface Props {
  params: { storeId: string };
}

export default function StoreStaffPage({ params }: Props) {
  const storeId = params.storeId as StoreId;
  if (!STORE_IDS.includes(storeId)) {
    notFound();
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Equipo {storeId}</h1>
        <p className="text-sm text-muted-foreground">Asignación de personal por turno y roles.</p>
      </div>
      <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
        Vista opcional pendiente de definición. Aquí puedes listar asistentes, turnos planificados y check-in/out.
      </div>
    </div>
  );
}
