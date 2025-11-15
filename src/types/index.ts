export type StoreId = "elroble" | "maipu" | "lareina";

export const STORE_LABELS: Record<StoreId, string> = {
  elroble: "El Roble",
  maipu: "Maipú",
  lareina: "La Reina",
};

export type EmployeeRole =
  | "admin_general"
  | "admin_local"
  | "supervisor"
  | "cajero"
  | "bodega"
  | "multi";

export type ContractType = "con_contrato" | "sin_contrato";

export type ShiftType = "dia" | "noche" | "manana" | "tarde" | "noche_extendida";

export type AttendanceStatus = "presente" | "ausente" | "atraso" | "retirado";

export type PayrollStatus = "pendiente" | "pagado";

export interface Employee {
  id: string;
  rut: string;
  full_name: string;
  role: EmployeeRole;
  store_id: StoreId | "multi";
  contract_type: ContractType;
  base_salary: number;
  hourly_rate?: number | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Shift {
  id: string | number;
  store_id: StoreId;
  seller: string;
  type: string;
  cash_initial?: number | null;
  cash_sales?: number | null;
  total_sales?: number | null;
  is_open?: boolean;
  opened_at?: string;
  closed_at?: string | null;
  status?: "open" | "closed";
  start_time?: string;
  end_time?: string | null;
}

export interface Product {
  id: string | number;
  store_id: StoreId;
  name: string;
  barcode?: string | null;
  category?: string | null;
  cost?: number | null;
  price?: number | null;
  stock: number;
  stock_min?: number | null;
  min_stock?: number | null;
  updated_at?: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  store_id: StoreId;
  date: string;
  shift_type: string;
  check_in?: string | null;
  check_out?: string | null;
  status: AttendanceStatus;
}

export interface PayrollRecord {
  id: string;
  employee_id: string;
  period: string;
  gross_salary: number;
  legal_discounts: Record<string, number>;
  other_discounts: Record<string, number>;
  net_salary: number;
  paid_at?: string | null;
  status: PayrollStatus;
}

export interface AdminMessage {
  id: string;
  store_id: StoreId | null;
  sender_id: string;
  receiver_id: string | null;
  title: string;
  body: string;
  created_at: string;
  read_by: string[];
}

export type NotificationType =
  | "stock"
  | "shift"
  | "message"
  | "payroll"
  | "general";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  createdAt: string;
  read: boolean;
  metadata?: Record<string, unknown>;
}

export interface DashboardKpi {
  id: string;
  label: string;
  value: string;
  trend?: string;
  status?: "positive" | "negative" | "neutral";
}

export const STORE_IDS: StoreId[] = ["elroble", "maipu", "lareina"];
