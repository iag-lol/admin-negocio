import { MessagesPanel } from "@/features/messages/components/messages-panel";
import { readSession } from "@/lib/auth";
import { ensureStoreId } from "@/lib/store";

export default async function MessagesPage() {
  const session = await readSession();
  const storeId = ensureStoreId(session?.store_id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Mensajes internos</h1>
        <p className="text-sm text-muted-foreground">Comunicación entre administración y locales.</p>
      </div>
      <MessagesPanel storeId={storeId} employeeId={session?.employee_id} />
    </div>
  );
}
