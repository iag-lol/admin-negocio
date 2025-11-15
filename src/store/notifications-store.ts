import { create } from "zustand";
import type { NotificationItem } from "@/types";

interface NotificationsState {
  items: NotificationItem[];
  addNotification: (item: NotificationItem) => void;
  markAsRead: (id: string) => void;
  clear: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  items: [],
  addNotification: (item) =>
    set((state) => ({
      items: [item, ...state.items.filter((existing) => existing.id !== item.id)],
    })),
  markAsRead: (id) =>
    set((state) => ({
      items: state.items.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    })),
  clear: () => set({ items: [] }),
}));
