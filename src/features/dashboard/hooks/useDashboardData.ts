import { useQuery } from "@tanstack/react-query";
import { fetchOpenShifts } from "@/services/shifts";
import { fetchProducts, calculateLowStock } from "@/services/products";
import { fetchAttendance } from "@/services/attendance";
import { fetchPayroll } from "@/services/payroll";
import { STORE_IDS, type Product, type StoreId } from "@/types";

export interface StoreSummary {
  storeId: StoreId;
  attendanceRate: number;
  salesToday: number;
  openShifts: number;
  lowStock: Product[];
  headcount: number;
}

export interface DashboardData {
  summaries: StoreSummary[];
  lowStockGlobal: { storeId: StoreId; product: Product }[];
  alerts: { id: string; title: string; description: string; severity: "info" | "warning" | "critical" }[];
}

async function loadStoreSummary(storeId: StoreId): Promise<StoreSummary> {
  const [shifts, products, attendance, payroll] = await Promise.all([
    fetchOpenShifts(storeId),
    fetchProducts(storeId),
    fetchAttendance(storeId),
    fetchPayroll(storeId),
  ]);

  const lowStock = calculateLowStock(products)
    .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
    .slice(0, 4);

  const completedAttendance = attendance.filter((record) => record.status === "presente");
  const attendanceRate = attendance.length === 0 ? 1 : completedAttendance.length / attendance.length;

  const salesToday = shifts.reduce((acc, shift) => acc + (shift.total_sales || 0), 0);
  const headcount = payroll.length || 12;

  return {
    storeId,
    attendanceRate: Number((attendanceRate * 100).toFixed(0)),
    salesToday,
    openShifts: shifts.length,
    lowStock,
    headcount,
  };
}

export function useDashboardData() {
  return useQuery<DashboardData>({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      const summaries = await Promise.all(STORE_IDS.map((store) => loadStoreSummary(store)));
      const lowStockGlobal = summaries.flatMap((summary) => summary.lowStock.map((item) => ({ storeId: summary.storeId, product: item })));

      const alerts = lowStockGlobal.slice(0, 5).map((entry, index) => ({
        id: `${entry.product.id}-${index}`,
        title: `${entry.product.name} en ${entry.storeId}`,
        description: `Stock actual ${entry.product.stock}, mínimo ${entry.product.stock_min ?? entry.product.min_stock}`,
        severity: entry.product.stock && entry.product.stock <= (entry.product.stock_min ?? entry.product.min_stock ?? 0) ? "critical" : "warning",
      }));

      return { summaries, lowStockGlobal, alerts };
    },
  });
}
