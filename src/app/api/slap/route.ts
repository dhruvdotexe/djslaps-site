import { NextResponse } from "next/server";
import { createSlapClient } from "@/lib/supabase";
import { getClientIp, hashIp, isNicknameAllowed } from "@/lib/moderation";

export const dynamic = "force-dynamic";

type Config = {
  url: string;
  anonKey: string;
};

function getConfig(): Config | null {
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
    return NextResponse.json(
      { total: 0, configured: true, error: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json({ total: data.total, configured: true });
}

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
    const body = (await request.json()) as { nickname?: unknown };
    if (typeof body?.nickname === "string" && body.nickname.trim()) {
      nickname = body.nickname.trim().slice(0, 24);
    }
  } catch {
    /* body optional */
  }

  if (nickname && !isNicknameAllowed(nickname)) {
    return NextResponse.json(
      { ok: false, reason: "nickname-rejected" },
      { status: 400 },
    );
  }

  const ipHash = hashIp(getClientIp(request), config.anonKey);

  const supabase = createSlapClient(config);
  const { data, error } = await supabase.rpc("record_slap", {
    p_ip_hash: ipHash,
    p_nickname: nickname,
  });

  if (error) {
    if (error.message.includes("RATE_LIMITED")) {
      return NextResponse.json(
        { ok: false, reason: "rate-limited" },
        { status: 429 },
      );
    }
    return NextResponse.json(
      { ok: false, reason: "db-error" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, total: data });
}
