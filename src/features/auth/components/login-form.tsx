"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "@/features/auth/schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSessionStore } from "@/store/session-store";
import { ensureStoreId } from "@/lib/store";

export function LoginForm() {
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { rut: "", password: "" } });
  const [error, setError] = useState<string | null>(null);
  const setSession = useSessionStore((state) => state.setSession);

  const onSubmit = async (values: LoginValues) => {
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Credenciales inválidas");
      }
      const data = await response.json();
      setSession({
        employeeId: data.employee.id,
        fullName: data.employee.full_name,
        role: data.employee.role,
        storeId: ensureStoreId(data.employee.store_id),
      });
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-1">
        <Label htmlFor="rut">RUT</Label>
        <Input id="rut" placeholder="12.345.678-9" {...form.register("rut")} />
        {form.formState.errors.rut && <p className="text-sm text-destructive">{form.formState.errors.rut.message}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" placeholder="••••••" {...form.register("password")} />
        {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}
