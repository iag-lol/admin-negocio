"use client";

import { useNotificationsStore } from "@/store/notifications-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Props {
  onClose?: () => void;
}

export function NotificationPanel({ onClose }: Props) {
  const items = useNotificationsStore((state) => state.items);
  const markAsRead = useNotificationsStore((state) => state.markAsRead);
  const clear = useNotificationsStore((state) => state.clear);

  return (
    <div className="absolute right-4 top-16 z-50 w-80 animate-in fade-in slide-in-from-top-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Notificaciones</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clear}>
              Limpiar
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cerrar
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 max-h-96 overflow-y-auto">
          {items.length === 0 && <p className="text-sm text-muted-foreground">Sin notificaciones</p>}
          {items.map((item) => (
            <div key={item.id} className="rounded-lg border border-border p-3 text-sm">
              <div className="flex items-center justify-between">
                <Badge variant={item.type === "stock" ? "destructive" : item.type === "shift" ? "secondary" : "outline"}>
                  {item.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="mt-2 text-sm text-foreground">{item.message}</p>
              {!item.read && (
                <Button className="mt-2" size="sm" variant="outline" onClick={() => markAsRead(item.id)}>
                  Marcar como leído
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
