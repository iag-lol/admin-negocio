"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchEmployees } from "@/services/employees";
import type { Employee, StoreId } from "@/types";
import { SimpleTable } from "@/components/data/simple-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const employeeSchema = z.object({
  rut: z.string().min(7),
  full_name: z.string().min(3),
  role: z.string().min(3),
  store_id: z.string().min(3),
  contract_type: z.string(),
  base_salary: z.coerce.number(),
  hourly_rate: z.coerce.number().optional(),
  password: z.string().min(4),
});

export function EmployeesTable({ storeId }: { storeId: StoreId }) {
  const { data: employees = [], isLoading } = useQuery({ queryKey: ["employees", storeId], queryFn: () => fetchEmployees(storeId) });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Empleados</h2>
        <NewEmployeeDialog storeId={storeId} />
      </div>
      <SimpleTable
        data={employees as Employee[]}
        columns={[
          { key: "full_name", label: "Nombre" },
          { key: "rut", label: "RUT" },
          { key: "role", label: "Rol" },
          { key: "store_id", label: "Local" },
          {
            key: "contract_type",
            label: "Contrato",
            render: (row) => <Badge variant={row.contract_type === "con_contrato" ? "secondary" : "outline"}>{row.contract_type}</Badge>,
          },
          {
            key: "is_active",
            label: "Estado",
            render: (row) => <Badge variant={row.is_active ? "secondary" : "destructive"}>{row.is_active ? "Activo" : "Inactivo"}</Badge>,
          },
        ]}
        emptyMessage={isLoading ? "Cargando..." : "Sin empleados"}
      />
    </div>
  );
}

function NewEmployeeDialog({ storeId }: { storeId: StoreId }) {
  const form = useForm({ resolver: zodResolver(employeeSchema), defaultValues: { store_id: storeId, role: "cajero", contract_type: "con_contrato" } });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof employeeSchema>) => {
      const response = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, store_id: values.store_id || storeId }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "No se pudo crear el empleado");
      }
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["employees", storeId] }),
  });

  const handleSubmit = async (values: z.infer<typeof employeeSchema>) => {
    await mutation.mutateAsync(values);
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Nuevo empleado</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear empleado</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <div>
            <Label>Nombre</Label>
            <Input {...form.register("full_name")} />
          </div>
          <div>
            <Label>RUT</Label>
            <Input {...form.register("rut")} />
          </div>
          <div>
            <Label>Rol</Label>
            <Input {...form.register("role")} />
          </div>
          <div>
            <Label>Local</Label>
            <Controller
              control={form.control}
              name="store_id"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elroble">El Roble</SelectItem>
                    <SelectItem value="maipu">Maipú</SelectItem>
                    <SelectItem value="lareina">La Reina</SelectItem>
                    <SelectItem value="multi">Multi</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label>Tipo de contrato</Label>
            <Controller
              control={form.control}
              name="contract_type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="con_contrato">Con contrato</SelectItem>
                    <SelectItem value="sin_contrato">Sin contrato</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label>Sueldo base</Label>
            <Input type="number" {...form.register("base_salary", { valueAsNumber: true })} />
          </div>
          <div>
            <Label>Valor hora</Label>
            <Input type="number" {...form.register("hourly_rate", { valueAsNumber: true })} />
          </div>
          <div>
            <Label>Contraseña inicial</Label>
            <Input type="password" {...form.register("password")} />
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Guardando..." : "Crear"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
