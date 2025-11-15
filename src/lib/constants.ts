import type { StoreId } from "@/types";

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "layout-dashboard" },
  {
    label: "Locales",
    icon: "store",
    children: [
      { href: "/stores/elroble/shifts", label: "El Roble" },
      { href: "/stores/maipu/shifts", label: "Maipú" },
      { href: "/stores/lareina/shifts", label: "La Reina" },
    ],
  },
  { href: "/admin/employees", label: "RRHH", icon: "users" },
  { href: "/admin/payroll", label: "Payroll", icon: "wallet" },
  { href: "/admin/logistics", label: "Logística", icon: "truck" },
  { href: "/admin/messages", label: "Mensajes", icon: "mail" },
  { href: "/me", label: "Perfil", icon: "user" },
];

export const BOTTOM_NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { href: "/stores/elroble/shifts", label: "Turnos", icon: "clock" },
  { href: "/stores/elroble/stock", label: "Stock", icon: "boxes" },
  { href: "/admin/messages", label: "Mensajes", icon: "mail" },
  { href: "/me", label: "Perfil", icon: "user" },
];

export const STORE_PATHS: Record<StoreId, string> = {
  elroble: "/stores/elroble",
  maipu: "/stores/maipu",
  lareina: "/stores/lareina",
};
