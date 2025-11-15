import { PayrollBoard } from "@/features/payroll/components/payroll-board";
import { PayrollGenerator } from "@/features/payroll/components/payroll-generator";
import { readSession } from "@/lib/auth";
import { ensureStoreId } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PayrollPage() {
  const session = await readSession();
  const storeId = ensureStoreId(session?.store_id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Payroll</h1>
        <p className="text-sm text-muted-foreground">Genera liquidaciones y marca pagos</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <PayrollBoard storeId={storeId} />
        <PayrollGenerator storeId={storeId} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Checklist legal</CardTitle>
          <CardDescription>Recuerda validar estos puntos antes de pagar</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-md border p-3">Comparar horas extra declaradas vs. attendance.</div>
          <div className="rounded-md border p-3">Verificar descuentos de AFP/Salud con tablas actualizadas.</div>
          <div className="rounded-md border p-3">Enviar respaldo de liquidación al colaborador.</div>
          <div className="rounded-md border p-3">Registrar pagos en Supabase payroll con fecha efectiva.</div>
        </CardContent>
      </Card>
    </div>
  );
}
