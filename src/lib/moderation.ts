import { createHash } from "crypto";

/** Banned substrings for nicknames (case-insensitive). */
const BANNED = [
  "cuck", "fuck", "shit", "bitch", "bastard",
  "nigg", "rape", "slut", "dick", "porn",
  "penis", "vagina", "sex", "nude", "kill",
];

export function isNicknameAllowed(nickname: string): boolean {
  const lower = nickname.toLowerCase();
  return !BANNED.some((word) => lower.includes(word));
}

/**
 * Hashes the visitor IP with the Supabase anon key as salt so the
 * stored value can't be reversed without server env access.
 */
export function hashIp(ip: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
