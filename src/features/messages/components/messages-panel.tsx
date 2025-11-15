"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMessages } from "@/services/messages";
import type { StoreId } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Props {
  storeId: StoreId;
  employeeId?: string;
}

export function MessagesPanel({ storeId, employeeId }: Props) {
  const queryClient = useQueryClient();
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", storeId],
    queryFn: () => fetchMessages(storeId, employeeId),
  });

  const form = useForm({ defaultValues: { title: "", body: "", target: "store" as "store" | "user" | "all" } });

  const mutation = useMutation({
    mutationFn: async (values: { title: string; body: string; target: "store" | "user" | "all" }) => {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          body: values.body,
          store_id: values.target === "all" ? null : storeId,
          receiver_id: values.target === "user" ? employeeId : null,
        }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "No se pudo enviar el mensaje");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", storeId] });
      form.reset({ title: "", body: "", target: "store" });
    },
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Mensajes</CardTitle>
          <CardDescription>Bandeja de entrada</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading && <p className="text-sm text-muted-foreground">Cargando...</p>}
          {messages.map((message) => (
            <div key={message.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{message.title}</p>
                  <p className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}</p>
                </div>
                <Badge variant={message.store_id ? "secondary" : "outline"}>{message.store_id ?? "Todos"}</Badge>
              </div>
              <p className="mt-2 text-sm">{message.body}</p>
            </div>
          ))}
          {messages.length === 0 && !isLoading && <p className="text-sm text-muted-foreground">Sin mensajes</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Nuevo mensaje</CardTitle>
          <CardDescription>Broadcast interno</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={onSubmit}>
            <div>
              <label className="text-sm font-medium">Título</label>
              <Input {...form.register("title", { required: true })} />
            </div>
            <div>
              <label className="text-sm font-medium">Mensaje</label>
              <Textarea rows={4} {...form.register("body", { required: true })} />
            </div>
            <div>
              <label className="text-sm font-medium">Destino</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2" {...form.register("target")}>
                <option value="store">Este local</option>
                <option value="all">Todos los locales</option>
                <option value="user">Directo a mi usuario</option>
              </select>
            </div>
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
