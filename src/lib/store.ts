import type { StoreId } from "@/types";

export function ensureStoreId(value?: string | null): StoreId {
  if (value === "maipu" || value === "lareina" || value === "elroble") {
    return value;
  }
  return "elroble";
}
