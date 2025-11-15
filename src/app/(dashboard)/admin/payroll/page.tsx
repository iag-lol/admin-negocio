import { PayrollBoard } from "@/features/payroll/components/payroll-board";
import { readSession } from "@/lib/auth";
import { ensureStoreId } from "@/lib/store";

export default async function PayrollPage() {
  const session = await readSession();
  const storeId = ensureStoreId(session?.store_id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Payroll</h1>
        <p className="text-sm text-muted-foreground">Genera liquidaciones y marca pagos</p>
      </div>
      <PayrollBoard storeId={storeId} />
    </div>
  );
}
