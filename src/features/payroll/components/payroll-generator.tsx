"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PayrollGeneratorProps {
  storeId: string;
}

export function PayrollGenerator({ storeId }: PayrollGeneratorProps) {
  const [period, setPeriod] = useState<string>("2025-01");
  const [notes, setNotes] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Generating payroll", { period, notes, storeId });
    alert(`Se generó el borrador de la nómina ${period}. Revisa Supabase para completarla.`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generar liquidación</CardTitle>
        <CardDescription>Crea un borrador mensual y sincroniza con RRHH</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Período</Label>
            <Input value={period} onChange={(event) => setPeriod(event.target.value)} placeholder="2025-06" />
          </div>
          <div>
            <Label>Notas</Label>
            <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} placeholder="Detalle de bonos, descuentos u observaciones" />
          </div>
          <Button type="submit">Generar borrador</Button>
        </form>
      </CardContent>
    </Card>
  );
}
