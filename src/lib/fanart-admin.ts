import { createClient } from "@supabase/supabase-js";

export type AdminConfig = {
  url: string;
  serviceKey: string;
  adminKey: string;
};

/**
 * Server-side client with service-role privileges (bypasses RLS).
 * Only used in API routes; the service key never reaches the browser.
 */
export function createAdminClient(config: Omit<AdminConfig, "adminKey">) {
  return createClient(config.url, config.serviceKey, {
    auth: { persistSession: false },
  });
}

/** Public anon client for reading the approved gallery. */
export function createPublicClient(url: string, anonKey: string) {
  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

/** Checks the X-Admin-Key header against the configured secret. */
export function isAdminAuthorized(request: Request, expectedKey: string): boolean {
  const provided = request.headers.get("x-admin-key");
  return Boolean(provided && provided === expectedKey);
}
