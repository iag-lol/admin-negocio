import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { StoreId } from "@/types";

const config = {
  elroble: {
    url: process.env.NEXT_PUBLIC_SUPABASE_ELROBLE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ELROBLE_ANON_KEY,
    label: "El Roble",
    comment: `
# El Roble
# NEXT_PUBLIC_SUPABASE_ELROBLE_URL=https://tcmtxvuucjttngcazgff.supabase.co
# NEXT_PUBLIC_SUPABASE_ELROBLE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjbXR4dnV1Y2p0dG5nY2F6Z2ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MjUwMDEsImV4cCI6MjA1NjMwMTAwMX0.2WcIjMUEhSM6j9kYpbsYArQocZdHx86k7wXk-NyjIs0
    `.trim(),
  },
  maipu: {
    url: process.env.NEXT_PUBLIC_SUPABASE_MAIPU_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_MAIPU_ANON_KEY,
    label: "Maipú",
    comment: `
# Maipu
# NEXT_PUBLIC_SUPABASE_MAIPU_URL=https://omvxnodsaiqtvxyrvebt.supabase.co
# NEXT_PUBLIC_SUPABASE_MAIPU_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tdnhub2RzYWlxdHZ4eXJ2ZWJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTkyMzgsImV4cCI6MjA3NzU5NTIzOH0.5QMmyk1GfAU09ng1NW21WmSpZszsVMX34U5fbyrjF_0
    `.trim(),
  },
  lareina: {
    url: process.env.NEXT_PUBLIC_SUPABASE_LAREINA_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_LAREINA_ANON_KEY,
    label: "La Reina",
    comment: `
# La Reina (placeholder)
# NEXT_PUBLIC_SUPABASE_LAREINA_URL=https://REEMPLAZAR_LA_REINA.supabase.co
# NEXT_PUBLIC_SUPABASE_LAREINA_ANON_KEY=REEMPLAZAR_LA_REINA_KEY
    `.trim(),
  },
} satisfies Record<StoreId, { url?: string; anonKey?: string; label: string; comment: string }>;

const cachedClients: Partial<Record<StoreId, SupabaseClient>> = {};

function bootstrapClient(storeId: StoreId): SupabaseClient {
  if (cachedClients[storeId]) {
    return cachedClients[storeId]!;
  }

  const { url, anonKey, label } = config[storeId];
  if (!url || !anonKey) {
    throw new Error(
      `Missing Supabase credentials for ${label}. Define NEXT_PUBLIC_SUPABASE_${storeId.toUpperCase()}_URL and *_ANON_KEY.\n${config[storeId].comment}`,
    );
  }

  const client = createClient(url, anonKey, {
    auth: {
      persistSession: false,
    },
    global: {
      headers: {
        "x-application-name": "admin-multilocal",
      },
    },
  });

  cachedClients[storeId] = client;
  return client;
}

export const supabaseElRoble = () => bootstrapClient("elroble");
export const supabaseMaipu = () => bootstrapClient("maipu");
export const supabaseLaReina = () => bootstrapClient("lareina");

export function getSupabaseClient(storeId: StoreId) {
  switch (storeId) {
    case "elroble":
      return supabaseElRoble();
    case "maipu":
      return supabaseMaipu();
    case "lareina":
      return supabaseLaReina();
    default:
      return supabaseElRoble();
  }
}
