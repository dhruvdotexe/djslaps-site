import { NextResponse } from "next/server";
import { createSlapClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return NextResponse.json([]);
  }
  const supabase = createSlapClient({ url, anonKey });
  const { data, error } = await supabase
    .from("slap_leaderboard")
    .select("nickname, slaps")
    .limit(10);
  if (error) {
    return NextResponse.json([], { status: 500 });
  }
  return NextResponse.json(data);
}
