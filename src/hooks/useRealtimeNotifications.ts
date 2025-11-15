"use client";

import { useEffect } from "react";
import { nanoid } from "nanoid";
import { STORE_IDS, type NotificationItem, type StoreId } from "@/types";
import { getSupabaseClient } from "@/lib/supabaseClients";
import { useNotificationsStore } from "@/store/notifications-store";

interface UseRealtimeNotificationsProps {
  storeId?: StoreId | null;
  employeeId?: string | null;
}

export function useRealtimeNotifications({ storeId, employeeId }: UseRealtimeNotificationsProps) {
  const addNotification = useNotificationsStore((state) => state.addNotification);

  useEffect(() => {
    if (!storeId || !employeeId) return;
    let cleanup = () => {};
    try {
      const productClient = getSupabaseClient(storeId);
      const shiftClient = getSupabaseClient(storeId);
      const messageClient = getSupabaseClient(storeId);

      const productChannel = productClient
        .channel(`products-${storeId}`)
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: storeId === "maipu" ? "elianamaipu_products" : "products" },
          (payload) => {
            const record = payload.new as { id: string; name: string; stock: number; stock_min?: number; min_stock?: number };
            const minStock = record.stock_min ?? record.min_stock ?? 0;
            if (minStock > 0 && record.stock <= minStock) {
              pushNotification({
                type: "stock",
                message: `${record.name} está en bajo stock (${record.stock} uds)`,
              });
            }
          },
        )
        .subscribe();

      const shiftChannel = shiftClient
        .channel(`shifts-${storeId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: storeId === "maipu" ? "elianamaipu_shifts" : "shifts" },
          (payload) => {
            const record = payload.new as { seller: string; type: string };
            pushNotification({
              type: "shift",
              message: `Nuevo turno abierto por ${record.seller} (${record.type})`,
            });
          },
        )
        .subscribe();

      const messageChannel = messageClient
        .channel(`admin_messages-${storeId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "admin_messages" },
          (payload) => {
            const record = payload.new as { title: string; body: string; store_id: StoreId | null; receiver_id: string | null };
            if (!record.store_id || record.store_id === storeId || record.receiver_id === employeeId) {
              pushNotification({
                type: "message",
                message: `${record.title}: ${record.body}`,
              });
            }
          },
        )
        .subscribe();

      cleanup = () => {
        productClient.removeChannel(productChannel);
        shiftClient.removeChannel(shiftChannel);
        messageClient.removeChannel(messageChannel);
      };
    } catch (error) {
      console.warn("Realtime not initialised", error);
    }

    return cleanup;

    function pushNotification(partial: Omit<NotificationItem, "id" | "createdAt" | "read">) {
      addNotification({
        id: nanoid(),
        createdAt: new Date().toISOString(),
        read: false,
        ...partial,
      });
    }
  }, [storeId, employeeId, addNotification]);
}

export function useGlobalRealtimeBoot() {
  useEffect(() => {
    STORE_IDS.forEach((store) => {
      try {
        getSupabaseClient(store);
      } catch (error) {
        console.warn("Realtime bootstrap skipped", error);
      }
    });
  }, []);
}
