import { createClient } from "@supabase/supabase-js";

export type SupabaseConfig = {
  url: string;
  anonKey: string;
};

export function createSlapClient(config: SupabaseConfig) {
  return createClient(config.url, config.anonKey, {
    auth: { persistSession: false },
  });
}
