import { getSupabaseClient } from "@/lib/supabaseClients";
import type { Product, StoreId } from "@/types";

export async function fetchProducts(storeId: StoreId) {
  const client = getSupabaseClient(storeId);
  const table = storeId === "maipu" ? "elianamaipu_products" : "products";
  const { data, error } = await client
    .from(table)
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("products.fetch", error);
    throw error;
  }

  return (data ?? []) as Product[];
}

export interface PurchaseProjection {
  productId: Product["id"];
  productName: Product["name"];
  stock: number;
  minStock: number;
  targetStock: number;
  suggestedPurchase: number;
  projectedOutOfStockDate: string;
}

export function calculateLowStock(products: Product[]) {
  return products.filter((product) => {
    const min = product.stock_min ?? product.min_stock ?? 0;
    return min > 0 && product.stock <= min;
  });
}

export function calculateNearCritical(products: Product[]) {
  return products.filter((product) => {
    const min = product.stock_min ?? product.min_stock ?? 0;
    if (min <= 0) return false;
    return product.stock > min && product.stock <= Math.ceil(min * 1.5);
  });
}

export function buildPurchaseProjection(products: Product[]): PurchaseProjection[] {
  return products.map((product) => {
    const min = product.stock_min ?? product.min_stock ?? 0;
    const target = Math.max(min * 2, min + 10);
    const consumptionPerDay = Math.max(Math.round((product.price ?? 1) / 4), 1);
    const daysLeft = Math.max(Math.floor(product.stock / consumptionPerDay), 0);
    return {
      productId: product.id,
      productName: product.name,
      stock: product.stock,
      minStock: min,
      targetStock: target,
      suggestedPurchase: Math.max(target - product.stock, 0),
      projectedOutOfStockDate: new Date(Date.now() + daysLeft * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
}
