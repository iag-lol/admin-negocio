"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SimpleTable } from "@/components/data/simple-table";
import { createShift, closeShift, fetchOpenShifts } from "@/services/shifts";
import type { StoreId } from "@/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

const optionalMoney = z.preprocess((val) => {
  if (val === "" || val === null || typeof val === "undefined") {
    return undefined;
  }
  const parsed = typeof val === "number" ? val : Number(val);
  return Number.isFinite(parsed) ? parsed : undefined;
}, z.number().optional());

const shiftSchema = z.object({
  seller: z.string().min(2),
  type: z.string().min(2),
  cash_initial: optionalMoney,
});

const closeSchema = z.object({
  total_sales: z.coerce.number(),
  cash_sales: optionalMoney,
  cash_counted: optionalMoney,
  difference: optionalMoney,
});

const scheduleBlocks = [
  { label: "Turno mañana", start: "07:00", end: "15:00", roles: ["Cocina", "Cajero"] },
  { label: "Turno tarde", start: "15:00", end: "22:00", roles: ["Barista", "Supervisor"] },
  { label: "Turno noche", start: "22:00", end: "06:00", roles: ["Supervisor", "Reposición"] },
];

const attendanceInsights = [
  { title: "Atrasos", value: 2, description: "Isaac B. y Tomás G. llegaron 10 min tarde" },
  { title: "Ausencias", value: 1, description: "Reemplazo solicitado para Carolina" },
  { title: "Horas extra", value: 4, description: "Revisar aprobación en payroll" },
];

export function ShiftBoard({ storeId }: { storeId: StoreId }) {
  const queryClient = useQueryClient();
  const { data: shifts = [], isLoading } = useQuery({
    queryKey: ["shifts", storeId],
    queryFn: () => fetchOpenShifts(storeId),
  });

  const createMutation = useMutation({
    mutationFn: (values: z.infer<typeof shiftSchema>) => createShift(storeId, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shifts", storeId] }),
  });

  const closeMutation = useMutation({
    mutationFn: ({ id, values }: { id: string | number; values: z.infer<typeof closeSchema> }) =>
      closeShift(storeId, id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shifts", storeId] }),
  });

  const lowCoverageAlert = useMemo(() => shifts.length === 0, [shifts]);

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Turnos abiertos</CardTitle>
          <CardDescription>Controla quén está operando actualmente en {storeId}</CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleTable
            data={shifts}
            columns={[
              { key: "seller", label: "Vendedor" },
              { key: "type", label: "Tipo" },
              {
                key: "opened_at",
                label: "Inicio",
                render: (row) => (row.opened_at ? format(new Date(row.opened_at), "HH:mm dd/MM") : "-"),
              },
              {
                key: "cash_initial",
                label: "Caja inicial",
                render: (row) => (row.cash_initial ? `$${row.cash_initial.toLocaleString()}` : "-"),
              },
              {
                key: "status",
                label: "Estado",
                render: (row) => <Badge variant={row.is_open || row.status === "open" ? "secondary" : "outline"}>{row.is_open || row.status === "open" ? "Abierto" : "Cerrado"}</Badge>,
              },
              {
                key: "actions" as keyof typeof shifts[number],
                label: "Acciones",
                render: (row) => <CloseShiftDialog onClose={(values) => closeMutation.mutate({ id: row.id, values })} />,
              },
            ]}
            emptyMessage={isLoading ? "Cargando..." : "Sin turnos abiertos"}
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <NewShiftDialog loading={createMutation.isPending} onSubmit={(values) => createMutation.mutate(values)} />
          {lowCoverageAlert && <p className="text-sm text-destructive">No hay turnos abiertos. Debes cubrir las próximas horas.</p>}
        </CardFooter>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Planificación diaria</CardTitle>
            <CardDescription>Asegura cobertura 24/7 del local</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {scheduleBlocks.map((block) => (
              <div key={block.label} className="rounded-lg border p-3">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{block.label}</span>
                  <Badge variant="outline">
                    {block.start} - {block.end}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Roles: {block.roles.join(", ")}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Asistencia y alertas</CardTitle>
            <CardDescription>Resumen de presentaciones del día</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {attendanceInsights.map((insight) => (
              <div key={insight.title} className="rounded-lg border p-3">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{insight.title}</span>
                  <Badge variant={insight.value > 0 ? "destructive" : "outline"}>{insight.value}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function normalizeNumeric(value?: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function NewShiftDialog({ onSubmit, loading }: { onSubmit: (values: z.infer<typeof shiftSchema>) => void; loading: boolean }) {
  const form = useForm({ resolver: zodResolver(shiftSchema), defaultValues: { seller: "", type: "dia", cash_initial: undefined } });

  const handleSubmit = (values: z.infer<typeof shiftSchema>) => {
    onSubmit({ ...values, cash_initial: normalizeNumeric(values.cash_initial) });
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Abrir turno</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo turno</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label>Vendedor</Label>
            <Input {...form.register("seller")} />
          </div>
          <div>
            <Label>Tipo</Label>
            <Input {...form.register("type")} placeholder="día / noche" />
          </div>
          <div>
            <Label>Caja inicial</Label>
            <Input type="number" {...form.register("cash_initial", { valueAsNumber: true })} />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creando..." : "Crear"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CloseShiftDialog({ onClose }: { onClose: (values: z.infer<typeof closeSchema>) => void }) {
  const form = useForm({ resolver: zodResolver(closeSchema), defaultValues: { total_sales: 0, cash_sales: undefined, cash_counted: undefined, difference: undefined } });

  const handleSubmit = (values: z.infer<typeof closeSchema>) => {
    onClose({
      total_sales: values.total_sales,
      cash_sales: normalizeNumeric(values.cash_sales),
      cash_counted: normalizeNumeric(values.cash_counted),
      difference: normalizeNumeric(values.difference),
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Cerrar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cerrar turno</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label>Ventas totales</Label>
            <Input type="number" {...form.register("total_sales", { valueAsNumber: true })} />
          </div>
          <div>
            <Label>Ventas efectivo</Label>
            <Input type="number" {...form.register("cash_sales", { valueAsNumber: true })} />
          </div>
          <div>
            <Label>Caja contada</Label>
            <Input type="number" {...form.register("cash_counted", { valueAsNumber: true })} />
          </div>
          <div>
            <Label>Diferencia</Label>
            <Input type="number" {...form.register("difference", { valueAsNumber: true })} />
          </div>
          <Button type="submit">Confirmar cierre</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
