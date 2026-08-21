import { NextResponse } from "next/server";
import { createSlapClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function getConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export async function GET() {
  const config = getConfig();
  if (!config) {
    // Feature not configured yet — report zero rather than erroring.
    return NextResponse.json({ total: 0, configured: false });
  }
  const supabase = createSlapClient(config);
  const { data, error } = await supabase
    .from("slap_counter")
    .select("total")
    .eq("id", 1)
    .single();
  if (error) {
    return NextResponse.json({ total: 0, configured: true, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ total: data.total, configured: true });
}

const RATE_LIMIT_MS = 1000;

export async function POST(request: Request) {
  const config = getConfig();
  if (!config) {
    return NextResponse.json(
      { ok: false, reason: "not-configured" },
      { status: 503 },
    );
  }

  let nickname: string | null = null;
  try {
    const body = await request.json();
    if (typeof body?.nickname === "string" && body.nickname.trim()) {
      nickname = body.nickname.trim().slice(0, 24);
    }
  } catch {
    /* body optional */
  }

  const supabase = createSlapClient(config);

  // Rate limit: reject if this IP slapped within the last second.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const cutoff = new Date(Date.now() - RATE_LIMIT_MS).toISOString();
  const { data: recent, error: recentErr } = await supabase
    .from("slaps")
    .select("id")
    .gte("created_at", cutoff)
    .limit(1);

  if (!recentErr && recent && recent.length > 0) {
    // Note: per-IP limiting needs a column we don't store; this global
    // throttle still blunts bursts. See README note for RLS-based hardening.
    return NextResponse.json(
      { ok: false, reason: "rate-limited" },
      { status: 429 },
    );
  }

  const { data: inc, error: incErr } = await supabase.rpc("increment_slaps");
  if (incErr || inc === null) {
    return NextResponse.json(
      { ok: false, reason: "db-error" },
      { status: 500 },
    );
  }

  await supabase.from("slaps").insert({ nickname });

  return NextResponse.json({ ok: true, total: inc });
}
